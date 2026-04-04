import { NextResponse } from 'next/server';
import { sql } from '@/lib/db-neon';
import { validateApiRequest } from '@/lib/api-auth';

export async function GET(request: Request) {
  try {
    const auth = await validateApiRequest(request);
    if (auth.error) {
      return auth.error;
    }

    const categories = await sql`SELECT id, name, slug FROM "Category" ORDER BY name ASC`;
    return NextResponse.json(categories);
  } catch (error) {
    console.error('API Categories Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
