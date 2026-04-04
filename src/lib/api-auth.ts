import { NextResponse } from 'next/server';

/**
 * Common CORS headers for the API.
 */
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, X-API-Key, X-WP-Nonce',
};

/**
 * Validates a request against the configured Basic Auth credentials.
 * Returns the username if successful, otherwise returns a NextResponse with 401.
 */
export async function validateApiRequest(request: Request) {
  const url = new URL(request.url);
  console.log(`[API AUTH] Processing request: ${request.method} ${url.pathname}`);

  // Handle CORS Preflight
  if (request.method === 'OPTIONS') {
    console.log('[API AUTH] Handling OPTIONS preflight');
    return {
      isPreflight: true,
      response: new NextResponse(null, { status: 204, headers: corsHeaders })
    };
  }

  const authHeader = request.headers.get('Authorization');

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    console.warn('[API AUTH] Missing or invalid Authorization header');
    return {
      error: new NextResponse(
        JSON.stringify({ error: 'Authorization header is missing or invalid' }),
        { 
          status: 401, 
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json',
            'WWW-Authenticate': 'Basic realm="API"' 
          } 
        }
      )
    };
  }

  try {
    const base64Credentials = authHeader.substring(6);
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');

    const expectedUsername = process.env.API_USERNAME;
    const expectedPassword = process.env.API_APP_PASSWORD;

    console.log(`[API AUTH] Credentials decoded for user: ${username}`);

    if (!expectedUsername || !expectedPassword) {
      console.error('[API AUTH] CRITICAL: API_USERNAME or API_APP_PASSWORD is not set in environment variables');
      return {
        error: new NextResponse(
          JSON.stringify({ error: 'Server configuration error: Missing environment variables' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      };
    }

    if (username === expectedUsername && password === expectedPassword) {
      console.log(`[API AUTH] Authentication successful for: ${username}`);
      return { username };
    }

    console.warn(`[API AUTH] Invalid credentials provided for: ${username}`);
    return {
      error: new NextResponse(
        JSON.stringify({ error: 'Invalid credentials' }),
        { 
          status: 401, 
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json',
            'WWW-Authenticate': 'Basic realm="API"' 
          } 
        }
      )
    };
  } catch (error) {
    console.error('[API AUTH] Internal Error decoding credentials:', error);
    return {
      error: new NextResponse(
        JSON.stringify({ error: 'Failed to decode credentials' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    };
  }
}
