import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Protected routes that require authentication
 * These routes will redirect to login if user is not authenticated
 */
const PROTECTED_ROUTES = [
  '/account',
  '/shop/checkout',
  '/story/create',
  '/story/edit',
];

/**
 * Public routes that should be accessible without authentication
 * These are routes that authenticated users should not access (redirect to home)
 */
const PUBLIC_AUTH_ROUTES = [
  '/login',
  '/register',
];

/**
 * Check if a path matches any of the protected routes
 */
function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some(route => {
    if (route.endsWith('/*')) {
      // Handle wildcard routes like /account/*
      const baseRoute = route.slice(0, -2);
      return pathname.startsWith(baseRoute);
    }
    // Exact match or starts with route + /
    return pathname === route || pathname.startsWith(`${route}/`);
  });
}

/**
 * Check if a path is a public auth route (login, register)
 */
function isPublicAuthRoute(pathname: string): boolean {
  return PUBLIC_AUTH_ROUTES.some(route =>
    pathname === route || pathname.startsWith(`${route}/`)
  );
}

/**
 * Check if user is authenticated by verifying access_token in cookies
 */
function isAuthenticated(request: NextRequest): boolean {
  const accessToken = request.cookies.get('access_token');
  return !!accessToken?.value;
}

/**
 * Proxy function to protect routes and handle authentication
 * Note: In Next.js 16+, middleware has been renamed to proxy to clarify
 * its purpose as a network boundary layer
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authenticated = isAuthenticated(request);

  // If user is authenticated and trying to access public auth routes (login/register)
  // redirect them to home page
  if (authenticated && isPublicAuthRoute(pathname)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If user is not authenticated and trying to access protected routes
  // redirect to login with return path
  if (!authenticated && isProtectedRoute(pathname)) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Allow request to proceed
  return NextResponse.next();
}

/**
 * Matcher configuration to specify which routes this proxy should run on
 * This prevents the proxy from running on:
 * - API routes
 * - Static files (_next/static)
 * - Image optimization files (_next/image)
 * - Favicon and other public files
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes (api/*)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, robots.txt, sitemap.xml (public files)
     * - files with extensions (e.g., .jpg, .png, .svg, .css, .js)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)',
  ],
};
