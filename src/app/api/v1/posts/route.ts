import { NextResponse } from 'next/server';
import { sql } from '@/lib/db-neon';
import { revalidatePath } from 'next/cache';
import { validateApiRequest, corsHeaders } from '@/lib/api-auth';

export async function POST(request: Request) {
  console.log(`[POSTS] POST request received: ${request.url}`);
  try {
    const auth = await validateApiRequest(request);
    
    if (auth.isPreflight) return auth.response;
    if (auth.error) return auth.error;

    const data = await request.json();
    console.log('[POSTS] Received data keys:', Object.keys(data));

    // --- WordPress Field Mapping ---
    const rawTitle = typeof data.title === 'object' ? data.title.rendered : data.title;
    const rawContent = typeof data.content === 'object' ? data.content.rendered : data.content;
    
    const title = rawTitle || "";
    const content = rawContent || "";
    
    // WordPress uses 'status' (publish/draft)
    const published = data.status === 'publish' || data.published === true || (data.status === undefined && data.published === undefined);
    
    // WordPress uses 'slug'
    const slug = data.slug || title.toLowerCase()
      .trim()
      .replace(/[\s\t\n_-]+/g, '-') 
      .replace(/[^\w\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');

    // --- Dynamic ID Resolution ---
    // Instead of hardcoding 'admin-id', fetch the first available user.
    const users = await sql`SELECT id FROM "User" WHERE role = 'ADMIN' LIMIT 1`;
    const fallbackUsers = await sql`SELECT id FROM "User" LIMIT 1`;
    const authorId = users[0]?.id || fallbackUsers[0]?.id || 'admin-id';

    // WordPress sends 'categories' as an array of IDs (integers)
    // We need our internal UUID categoryId. Fetch first category if not specified.
    let categoryId = data.categoryId;
    if (!categoryId) {
      let categories = await sql`SELECT id FROM "Category" WHERE name = 'すべて' LIMIT 1`;
      if (categories.length === 0) {
        categories = await sql`SELECT id FROM "Category" LIMIT 1`;
      }
      categoryId = categories[0]?.id;
    }

    if (!title || !slug || !content || !categoryId) {
      console.warn('[POSTS] Validation failed after mapping:', { title: !!title, slug: !!slug, content: !!content, categoryId: !!categoryId });
      return NextResponse.json({ error: 'Missing required fields (title, content, or categoryId mapping failed)' }, { status: 400, headers: corsHeaders });
    }

    const subtitle = data.subtitle || "";
    const coverImage = data.coverImage || data.featured_media_url || null;
    const readingTime = data.readingTime || null;

    // Check if we already have this post by slug to decide between Create/Update
    const existing = await sql`SELECT id FROM "Post" WHERE slug = ${slug} LIMIT 1`;
    
    if (existing.length > 0 || data.id) {
      const postId = data.id || existing[0].id;
      console.log(`[POSTS] Updating post: ${slug} (${postId})`);
      await sql`
        UPDATE "Post"
        SET title = ${title}, slug = ${slug}, subtitle = ${subtitle}, 
            content = ${content}, "coverImage" = ${coverImage}, 
            "readingTime" = ${readingTime}, "categoryId" = ${categoryId},
            published = ${published},
            "updatedAt" = NOW()
        WHERE id = ${postId} OR slug = ${slug}
      `;
    } else {
      console.log(`[POSTS] Creating new post: ${slug}`);
      await sql`
        INSERT INTO "Post" (id, title, slug, subtitle, content, "coverImage", "readingTime", published, "authorId", "categoryId")
        VALUES (gen_random_uuid()::text, ${title}, ${slug}, ${subtitle}, ${content}, ${coverImage}, ${readingTime}, ${published}, ${authorId}, ${categoryId})
      `;
    }

    // --- Forced Revalidation ---
    revalidatePath('/');
    revalidatePath('/admin/posts');
    revalidatePath(`/articles/${slug}`);
    
    // Also revalidate categories because the Home page list is often filtered by category
    const allCategories = await sql`SELECT name, slug FROM "Category"`;
    allCategories.forEach(cat => {
      revalidatePath(`/?category=${cat.name}`);
      revalidatePath(`/?category=${cat.slug}`);
    });

    console.log('[POSTS] Operation successful');
    return NextResponse.json({ success: true, message: 'Operation successful' }, { headers: corsHeaders });
  } catch (error) {
    console.error('[POSTS] ERROR:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500, headers: corsHeaders });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}
