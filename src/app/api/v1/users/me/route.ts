import { NextResponse } from 'next/server';
import { validateApiRequest, corsHeaders } from '@/lib/api-auth';

export async function GET(request: Request) {
  console.log(`[USERS/ME] Verification request received: ${request.url}`);
  try {
    const auth = await validateApiRequest(request);
    
    if (auth.isPreflight) return auth.response;
    if (auth.error) return auth.error;

    // Return the authenticated user profile in WordPress format
    // This satisfies the connection check that verifying identity.
    const userResponse = {
      id: 1,
      name: auth.username,
      first_name: auth.username.split('@')[0],
      last_name: "",
      description: "Ponz Academy Administrator via API",
      link: `https://ponz-academy.vercel.app/author/${auth.username}`,
      slug: auth.username.split('@')[0],
      URL: "https://ponz-academy.vercel.app",
      avatar_urls: {
        "24": "https://secure.gravatar.com/avatar/?s=24&d=mm&r=g",
        "48": "https://secure.gravatar.com/avatar/?s=48&d=mm&r=g",
        "96": "https://secure.gravatar.com/avatar/?s=96&d=mm&r=g"
      },
      meta: [],
      roles: ["administrator"],
      _links: {
        self: [{ href: "https://ponz-academy.vercel.app/wp-json/wp/v2/users/me" }],
        collection: [{ href: "https://ponz-academy.vercel.app/wp-json/wp/v2/users" }]
      }
    };

    console.log(`[USERS/ME] Verification successful for: ${auth.username}`);
    return NextResponse.json(userResponse, { headers: corsHeaders });
  } catch (error) {
    console.error('[USERS/ME] ERROR:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500, headers: corsHeaders });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}
