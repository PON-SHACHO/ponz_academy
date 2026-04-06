import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { validateApiRequest, corsHeaders } from '@/lib/api-auth';

export async function GET() {
  console.log('[MEDIA] Health check GET received');
  return NextResponse.json({ status: 'ok', message: 'Media endpoint is live' }, { headers: corsHeaders });
}

export async function POST(request: Request) {
  const url = new URL(request.url);
  console.log(`[MEDIA] POST request started: ${request.method} ${url.pathname}`);
  try {
    const auth = await validateApiRequest(request);

    if (auth.isPreflight) return auth.response;
    if (auth.error) return auth.error;

    const contentType = request.headers.get('content-type') || '';
    console.log(`[MEDIA] Content-Type: ${contentType}`);

    let filename: string;
    let fileBuffer: ArrayBuffer;
    let mimeType: string;

    if (contentType.includes('multipart/form-data')) {
      // Standard WordPress media upload: multipart/form-data
      const formData = await request.formData();
      const file = formData.get('file') as File | null;

      if (!file) {
        console.warn('[MEDIA] No file found in multipart/form-data');
        return NextResponse.json({ error: 'No file provided' }, { status: 400, headers: corsHeaders });
      }

      filename = file.name || `upload-${Date.now()}.jpg`;
      fileBuffer = await file.arrayBuffer();
      mimeType = file.type || 'image/jpeg';
      console.log(`[MEDIA] Received file: ${filename} (${mimeType}, ${fileBuffer.byteLength} bytes)`);
    } else {
      // Binary upload fallback
      fileBuffer = await request.arrayBuffer();
      const ext = contentType.split('/')[1]?.split(';')[0] || 'jpg';
      filename = `upload-${Date.now()}.${ext}`;
      mimeType = contentType.split(';')[0] || 'image/jpeg';
      console.log(`[MEDIA] Received binary: ${filename} (${mimeType}, ${fileBuffer.byteLength} bytes)`);
    }

    // Upload to Vercel Blob
    const blob = await put(`media/${Date.now()}-${filename}`, fileBuffer, {
      access: 'public',
      contentType: mimeType,
    });

    console.log(`[MEDIA] Uploaded successfully: ${blob.url}`);

    // Return WordPress-compatible response
    const response = {
      id: Date.now(),
      date: new Date().toISOString(),
      slug: filename.replace(/\.[^/.]+$/, ''),
      status: 'inherit',
      type: 'attachment',
      link: blob.url,
      title: { rendered: filename },
      media_type: 'image',
      mime_type: mimeType,
      source_url: blob.url,
      url: blob.url,
    };

    return NextResponse.json(response, { headers: corsHeaders });
  } catch (error) {
    console.error('[MEDIA] ERROR:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: (error as Error).message },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}
