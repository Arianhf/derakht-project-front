/**
 * Utility functions for route handling and protection checks
 */

/**
 * List of protected routes that require authentication
 * Should match the protectedRoutes array in middleware.ts
 */
const PROTECTED_ROUTES = [
    '/account',          // Account management
    '/shop/checkout',    // Checkout process
    '/story/create',     // Creating new stories
    '/story/edit'        // Editing stories
];

/**
 * Checks if a given pathname requires authentication
 * @param pathname - The pathname to check (e.g., '/account/profile')
 * @returns true if the route requires authentication, false otherwise
 */
export const isProtectedRoute = (pathname: string): boolean => {
    return PROTECTED_ROUTES.some(route => pathname.startsWith(route));
};

/**
 * Determines the redirect URL after logout
 * If the current path is protected, returns home ('/'), otherwise returns the current path
 * @param currentPath - The current pathname
 * @returns The appropriate redirect path after logout
 */
export const getPostLogoutRedirect = (currentPath: string): string => {
    return isProtectedRoute(currentPath) ? '/' : currentPath;
};
