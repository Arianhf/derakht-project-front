// src/middleware.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    const accessToken = req.cookies.get("access_token");
    const isAuthenticated = !!accessToken;

    // Define protected routes that should require authentication
    const protectedRoutes = [
        '/account',          // Account management
        '/checkout',         // Checkout process
        '/story/create',     // Creating new stories
        '/story/edit'        // Editing stories
    ];

    // Check if current path requires authentication
    const requiresAuth = protectedRoutes.some(route =>
        req.nextUrl.pathname.startsWith(route)
    );

    // If route requires auth and user is not authenticated, redirect to login
    if (requiresAuth && !isAuthenticated) {
        // Include the original URL as a query parameter
        const loginUrl = new URL("/login", req.url);
        loginUrl.searchParams.set("redirect", req.nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

// Only match the specified paths for middleware execution
export const config = {
    matcher: [
        '/',
        '/account/:path*',
        '/story/create/:path*',
        '/story/edit/:path*',
        '/checkout/:path*',
        '/login',
    ],
};