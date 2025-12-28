// API proxy route to avoid CORS issues in development
// Proxies requests from /api/* to the backend API
import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'https://derakht.darkube.app/api';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(request, params, 'GET');
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(request, params, 'POST');
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(request, params, 'PUT');
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(request, params, 'PATCH');
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(request, params, 'DELETE');
}

async function proxyRequest(
  request: NextRequest,
  params: Promise<{ path: string[] }>,
  method: string
) {
  const { path } = await params;
  const pathname = path.join('/');

  // Build the backend URL with query parameters
  // IMPORTANT: Django REST Framework expects trailing slashes
  // Next.js catch-all routes don't preserve trailing slashes in path params,
  // so we need to add them back for Django endpoints
  const url = new URL(request.url);

  // Check if original request had trailing slash (before Next.js stripped it)
  const originalHasTrailingSlash = url.pathname.endsWith('/');

  // For Django endpoints, we should always add trailing slash
  // Exception: static files or specific endpoints that don't need it
  const needsTrailingSlash = !pathname.match(/\.(jpg|jpeg|png|gif|svg|css|js|json)$/i);

  const shouldAddTrailingSlash = originalHasTrailingSlash || needsTrailingSlash;
  const backendUrl = `${BACKEND_URL}/${pathname}${shouldAddTrailingSlash ? '/' : ''}${url.search}`;

  // DEBUG LOGGING
  console.log('========== API PROXY DEBUG ==========');
  console.log('[Proxy] Method:', method);
  console.log('[Proxy] Original URL:', request.url);
  console.log('[Proxy] URL pathname:', url.pathname);
  console.log('[Proxy] Path array:', path);
  console.log('[Proxy] Joined pathname:', pathname);
  console.log('[Proxy] Original has trailing slash?:', originalHasTrailingSlash);
  console.log('[Proxy] Needs trailing slash?:', needsTrailingSlash);
  console.log('[Proxy] Will add trailing slash?:', shouldAddTrailingSlash);
  console.log('[Proxy] Query string:', url.search);
  console.log('[Proxy] Final backend URL:', backendUrl);
  console.log('====================================');

  // Copy headers from incoming request
  const headers: HeadersInit = {};
  request.headers.forEach((value, key) => {
    // Skip host header to avoid issues
    if (key.toLowerCase() !== 'host') {
      headers[key] = value;
    }
  });

  // Prepare request options
  const options: RequestInit = {
    method,
    headers,
  };

  // Add body for POST, PUT, PATCH requests
  if (method !== 'GET' && method !== 'DELETE') {
    try {
      // Special handling for upload_template_image endpoint
      const isImageUpload = pathname.includes('upload_template_image');

      if (isImageUpload) {
        console.log('========== IMAGE UPLOAD DEBUG ==========');
        console.log('[ImageUpload] Endpoint detected:', pathname);
        console.log('[ImageUpload] Content-Type:', request.headers.get('content-type'));
        console.log('[ImageUpload] Content-Length:', request.headers.get('content-length'));

        // For multipart/form-data, we need to preserve the boundary
        // So we read as blob and pass it through
        const blob = await request.blob();
        console.log('[ImageUpload] Body blob size:', blob.size);
        console.log('[ImageUpload] Body blob type:', blob.type);
        options.body = blob;
        console.log('========================================');
      } else {
        const body = await request.text();
        if (body) {
          options.body = body;
        }
      }
    } catch (error) {
      console.error('[Proxy] Error reading request body:', error);
    }
  }

  try {
    // Make request to backend
    const response = await fetch(backendUrl, options);

    // DEBUG LOGGING - Response
    console.log('[Proxy] Response status:', response.status, response.statusText);
    console.log('[Proxy] Response headers:', Object.fromEntries(response.headers.entries()));

    // Special logging for image upload responses
    const isImageUpload = pathname.includes('upload_template_image');
    if (isImageUpload) {
      console.log('========== IMAGE UPLOAD RESPONSE ==========');
      console.log('[ImageUpload Response] Status:', response.status);
      console.log('[ImageUpload Response] Status Text:', response.statusText);
      console.log('[ImageUpload Response] Content-Type:', response.headers.get('content-type'));

      // Clone response to read body without consuming it
      const clonedResponse = response.clone();
      try {
        const responseText = await clonedResponse.text();
        console.log('[ImageUpload Response] Body length:', responseText.length);
        console.log('[ImageUpload Response] Body preview (first 500 chars):', responseText.substring(0, 500));
      } catch (e) {
        console.error('[ImageUpload Response] Could not read response body:', e);
      }
      console.log('===========================================');
    }

    // Copy response headers, but skip encoding-related headers
    // The fetch API already handles decompression, so we don't want the browser to try again
    const responseHeaders = new Headers();
    const headersToSkip = [
      'content-encoding',
      'content-length',
      'transfer-encoding',
    ];

    response.headers.forEach((value, key) => {
      if (!headersToSkip.includes(key.toLowerCase())) {
        responseHeaders.set(key, value);
      }
    });

    // Return proxied response
    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('[API Proxy] Error:', error);
    return NextResponse.json(
      { error: 'Proxy request failed', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 502 }
    );
  }
}
