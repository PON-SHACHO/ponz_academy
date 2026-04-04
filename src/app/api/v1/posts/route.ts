import { NextResponse } from 'next/server';
import { sql } from '@/lib/db-neon';
import { revalidatePath } from 'next/cache';
import { validateApiRequest } from '@/lib/api-auth';

export async function POST(request: Request) {
  try {
    const auth = await validateApiRequest(request);
    if (auth.error) {
      return auth.error;
    }

    const data = await request.json();
    const { id, title, slug, subtitle, content, coverImage, readingTime, categoryId, published = true } = data;

    if (!title || !slug || !content || !categoryId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Use the authenticated user's ID or a default admin ID
    const authorId = data.authorId || 'admin-id';

    if (id) {
      // Update
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
      // Create
      const existing = await sql`SELECT id FROM "Post" WHERE slug = ${slug} LIMIT 1`;
      if (existing.length > 0) {
        return NextResponse.json({ error: 'Post with this slug already exists' }, { status: 409 });
      }

      await sql`
        INSERT INTO "Post" (id, title, slug, subtitle, content, "coverImage", "readingTime", published, "authorId", "categoryId")
        VALUES (gen_random_uuid()::text, ${title}, ${slug}, ${subtitle}, ${content}, ${coverImage}, ${readingTime}, ${published}, ${authorId}, ${categoryId})
      `;
    }

    revalidatePath('/');
    revalidatePath('/admin/posts');
    revalidatePath(`/articles/${slug}`);

    return NextResponse.json({ success: true, message: id ? 'Post updated' : 'Post created' });
  } catch (error) {
    console.error('API Posts Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
