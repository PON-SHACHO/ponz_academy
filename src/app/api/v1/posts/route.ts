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
    const { id, title, slug, subtitle, content, coverImage, readingTime, categoryId, published = true } = data;

    if (!title || !slug || !content || !categoryId) {
      console.warn('[POSTS] Missing required fields in request');
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400, headers: corsHeaders });
    }

    const authorId = data.authorId || 'admin-id';

    if (id) {
      console.log(`[POSTS] Updating post ID: ${id}`);
      await sql`
        UPDATE "Post"
        SET title = ${title}, slug = ${slug}, subtitle = ${subtitle}, 
            content = ${content}, "coverImage" = ${coverImage}, 
            "readingTime" = ${readingTime}, "categoryId" = ${categoryId},
            published = ${published},
            "updatedAt" = NOW()
        WHERE id = ${id}
      `;
    } else {
      console.log(`[POSTS] Creating new post with slug: ${slug}`);
      const existing = await sql`SELECT id FROM "Post" WHERE slug = ${slug} LIMIT 1`;
      if (existing.length > 0) {
        console.warn(`[POSTS] Slug conflict: ${slug}`);
        return NextResponse.json({ error: 'Post with this slug already exists' }, { status: 409, headers: corsHeaders });
      }

      await sql`
        INSERT INTO "Post" (id, title, slug, subtitle, content, "coverImage", "readingTime", published, "authorId", "categoryId")
        VALUES (gen_random_uuid()::text, ${title}, ${slug}, ${subtitle}, ${content}, ${coverImage}, ${readingTime}, ${published}, ${authorId}, ${categoryId})
      `;
    }

    revalidatePath('/');
    revalidatePath('/admin/posts');
    revalidatePath(`/articles/${slug}`);

    console.log('[POSTS] Operation successful');
    return NextResponse.json({ success: true, message: id ? 'Post updated' : 'Post created' }, { headers: corsHeaders });
  } catch (error) {
    console.error('[POSTS] ERROR:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500, headers: corsHeaders });
  }
}

export async function OPTIONS() {
  console.log('[POSTS] OPTIONS received');
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}
