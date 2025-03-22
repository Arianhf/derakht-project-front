import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    const accessToken = req.cookies.get("access_token");
    const isAuthenticated = !!accessToken;
    console.log(isAuthenticated);
    console.log(req.nextUrl.pathname);

    // Redirect root to blog page
    if (req.nextUrl.pathname === "/") {
        return NextResponse.redirect(new URL("/blog", req.url));
    }

    // Check authentication for protected routes
    if (!isAuthenticated &&
        (req.nextUrl.pathname !== "/login" &&
            (req.nextUrl.pathname.startsWith("/account") ||
                req.nextUrl.pathname.startsWith("/story") ||
                req.nextUrl.pathname.startsWith("/shop") ||
                req.nextUrl.pathname.startsWith("/cart") ||
                req.nextUrl.pathname.startsWith("/checkout")))) {
        // Include the original URL as a query parameter
        const loginUrl = new URL("/login", req.url);
        loginUrl.searchParams.set("redirect", req.nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/',
        '/account/:path*',
        '/story/:path*',
        '/shop/:path*',
        '/cart/:path*',
        '/checkout/:path*'
    ],
};