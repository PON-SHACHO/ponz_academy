import { NextResponse } from 'next/server';
import { sql } from '@/lib/db-neon';
import { validateApiRequest, corsHeaders } from '@/lib/api-auth';

export async function GET(request: Request) {
  try {
    const auth = await validateApiRequest(request);
    
    if (auth.isPreflight) return auth.response;
    if (auth.error) return auth.error;

    const categories = await sql`SELECT id, name, slug FROM "Category" ORDER BY name ASC`;
    return NextResponse.json(categories, { headers: corsHeaders });
  } catch (error) {
    console.error('API Categories Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500, headers: corsHeaders });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}
