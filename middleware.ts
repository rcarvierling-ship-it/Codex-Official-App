import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { normalizeRole, type Role } from "@/lib/nav";
import { roleAllows } from "@/lib/acl";

const PUBLIC_PATHS = ["/", "/demo", "/login", "/logout", "/signup", "/api/auth"];
const PROTECTED_PREFIXES = [
  "/admin",
  "/events",
  "/officials",
  "/requests",
  "/approvals",
  "/assignments",
  "/announcements",
  "/teams",
  "/venues",
  "/analytics",
  "/activity",
  "/api-explorer",
  "/dev-tools",
  "/profile",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Check if path needs protection
  const needsProtection = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  if (!needsProtection) {
    return NextResponse.next();
  }

  // Get token from NextAuth
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    // Log warning but don't crash - allow request to proceed with warning
    if (process.env.NODE_ENV === "production") {
      console.warn("[middleware] Missing NEXTAUTH_SECRET in production. Set this environment variable for secure authentication.");
    }
    // In production without secret, redirect to login to avoid security issues
    if (process.env.NODE_ENV === "production") {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }
  
  const token = await getToken({ 
    req: request, 
    secret: secret || undefined
  });

  // If no token, redirect to login
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Get role from token
  const role = normalizeRole((token as any).role ?? "USER");

  // Check if role allows access to this path
  if (!roleAllows(role, pathname)) {
    // Redirect to a page they can access, or show forbidden
    const allowedPaths = ["/admin", "/events", "/profile"];
    const fallback = allowedPaths.find((path) => roleAllows(role, path)) || "/";
    return NextResponse.redirect(new URL(fallback, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Only protect specific paths, not the root route
    "/dashboard/:path*",
    "/admin/:path*",
    "/test/:path*",
    "/events/:path*",
    "/officials/:path*",
    "/requests/:path*",
    "/approvals/:path*",
    "/assignments/:path*",
    "/announcements/:path*",
    "/teams/:path*",
    "/venues/:path*",
    "/analytics/:path*",
    "/activity/:path*",
    "/profile/:path*",
  ],
};

