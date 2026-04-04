import { NextResponse } from 'next/server';
import { corsHeaders } from '@/lib/api-auth';

export async function GET(request: Request) {
  const headers: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    // Sanitize sensitive headers if necessary, but for debug we want to see them
    headers[key] = value;
  });

  console.log('--- API DEBUG REQUEST RECEIVED ---');
  console.log('URL:', request.url);
  console.log('Headers:', JSON.stringify(headers, null, 2));

  return NextResponse.json({
    status: 'ok',
    message: 'Next.js application reached successfully',
    request_url: request.url,
    headers: headers,
    time: new Date().toISOString(),
  }, { headers: corsHeaders });
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}
