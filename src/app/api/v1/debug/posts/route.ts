import { NextResponse } from 'next/server';
import { sql } from '@/lib/db-neon';

export async function GET() {
  try {
    const posts = await sql`
      SELECT p.id, p.title, p.slug, p.published, p."authorId", p."categoryId", c.name as "categoryName"
      FROM "Post" p
      LEFT JOIN "Category" c ON p."categoryId" = c.id
      ORDER BY p."createdAt" DESC
    `;
    return NextResponse.json({
      count: posts.length,
      posts: posts
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
