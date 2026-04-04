import { NextResponse } from 'next/server';
import { sql } from '@/lib/db-neon';

export async function GET() {
  try {
    const posts = await sql`SELECT id, title, slug, published, "authorId", "categoryId", "createdAt" FROM "Post" ORDER BY "createdAt" DESC`;
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
