import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { PROTECTED_ROUTES, AUTH_ROUTES, ROUTES } from '@/config/routes';

/**
 * Next.js Proxy (formerly Middleware)
 * @description Serves as the application's "Security Guard" in Next.js 16.
 * Handles route protection and authentication redirection.
 * Note: Runs on NodeJS runtime in Next.js 16.
 */
export function proxy(request: NextRequest) {
  const { nextUrl } = request;
  const token = request.cookies.get('auth_token')?.value;

  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    nextUrl.pathname.startsWith(route)
  );
  const isAuthRoute = AUTH_ROUTES.some((route) =>
    nextUrl.pathname.startsWith(route)
  );

  // 1. If user is trying to access a protected route without a token
  if (isProtectedRoute && !token) {
    const loginUrl = new URL(ROUTES.LOGIN, request.url);
    // Add the current URL as a redirect query param to return after login
    loginUrl.searchParams.set('callbackUrl', nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. If user is logged in but trying to access login/register
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL(ROUTES.HOME, request.url));
  }

  return NextResponse.next();
}

/**
 * Proxy Configuration
 * @description Defines which paths the proxy should run on.
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
