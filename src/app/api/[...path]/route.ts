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
  const url = new URL(request.url);
  const backendUrl = `${BACKEND_URL}/${pathname}${url.search}`;

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
      const body = await request.text();
      if (body) {
        options.body = body;
      }
    } catch (error) {
      // No body or error reading body
    }
  }

  try {
    // Make request to backend
    const response = await fetch(backendUrl, options);

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
