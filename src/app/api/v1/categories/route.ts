import { NextResponse } from 'next/server';
import { sql } from '@/lib/db-neon';
import { validateApiRequest, corsHeaders } from '@/lib/api-auth';

export async function GET(request: Request) {
  console.log(`[CATEGORIES] GET request received: ${request.url}`);
  try {
    const auth = await validateApiRequest(request);
    
    if (auth.isPreflight) return auth.response;
    if (auth.error) return auth.error;

    const categories = await sql`SELECT id, name, slug FROM "Category" ORDER BY name ASC`;
    console.log(`[CATEGORIES] Returning ${categories.length} categories`);
    return NextResponse.json(categories, { headers: corsHeaders });
  } catch (error) {
    console.error('[CATEGORIES] ERROR:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500, headers: corsHeaders });
  }
}

export async function OPTIONS() {
  console.log('[CATEGORIES] OPTIONS received');
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}
