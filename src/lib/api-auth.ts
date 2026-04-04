import { NextResponse } from 'next/server';

/**
 * Validates a request against the configured Basic Auth credentials.
 * Returns the username if successful, otherwise returns a NextResponse with 401.
 */
export async function validateApiRequest(request: Request) {
  const authHeader = request.headers.get('Authorization');

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return {
      error: NextResponse.json(
        { error: 'Authorization header is missing or invalid' },
        { status: 401, headers: { 'WWW-Authenticate': 'Basic realm="API"' } }
      )
    };
  }

  try {
    const base64Credentials = authHeader.substring(6);
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');

    const expectedUsername = process.env.API_USERNAME;
    const expectedPassword = process.env.API_APP_PASSWORD;

    if (!expectedUsername || !expectedPassword) {
      console.warn('API credentials are not configured in environment variables');
      return {
        error: NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
      };
    }

    if (username === expectedUsername && password === expectedPassword) {
      return { username };
    }

    return {
      error: NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401, headers: { 'WWW-Authenticate': 'Basic realm="API"' } }
      )
    };
  } catch (error) {
    console.error('Auth Decoding Error:', error);
    return {
      error: NextResponse.json({ error: 'Failed to decode credentials' }, { status: 400 })
    };
  }
}
