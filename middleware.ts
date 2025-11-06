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
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || "dev-secret-change-in-production" 
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
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

