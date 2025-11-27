import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Public paths that don't require authentication
const PUBLIC_PATHS = [
  "/",
  "/demo",
  "/browser",
  "/login",
  "/logout",
  "/signup",
  "/onboarding",
];

// Static assets and Next.js internal routes - always allow
const STATIC_PATHS = [
  "/_next",
  "/favicon.ico",
  "/api/auth",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Always allow static assets and Next.js internal routes
  if (
    STATIC_PATHS.some((path) => pathname.startsWith(path)) ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|css|js|woff|woff2|ttf|eot)$/)
  ) {
    return NextResponse.next();
  }

  // Always allow API routes (they handle their own auth)
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // Allow public paths without authentication check
  if (PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Get token from NextAuth
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    // In production without secret, redirect to login to avoid security issues
    if (process.env.NODE_ENV === "production") {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    // In development, allow access with warning
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: secret || undefined,
  });

  // If no token (not authenticated), redirect to login
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // User is authenticated - middleware's job is done
  // Let pages handle onboarding checks and role-based routing
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
