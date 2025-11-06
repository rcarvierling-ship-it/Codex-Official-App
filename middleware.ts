import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

import { GUARDED_PREFIXES, roleAllows } from "@/lib/acl";
import { normalizeRole, type Role } from "@/lib/nav";

const ROLE_COOKIE = "theofficialapp-role";
const TOAST_COOKIE = "x-toast";

function needsGuard(pathname: string) {
  return GUARDED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (!needsGuard(pathname)) {
    return NextResponse.next();
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const tokenRole = token?.role as Role | undefined;
  const cookieRole = req.cookies.get(ROLE_COOKIE)?.value as Role | undefined;
  const role: Role = normalizeRole(tokenRole ?? cookieRole);

  if (roleAllows(role, pathname)) {
    const res = NextResponse.next();
    res.cookies.set(ROLE_COOKIE, role, { path: "/", httpOnly: false });
    return res;
  }

  const destination = role === "OFFICIAL" ? "/admin" : "/";
  const redirectUrl = req.nextUrl.clone();
  redirectUrl.pathname = destination;
  redirectUrl.searchParams.set("from", pathname);

  const res = NextResponse.redirect(redirectUrl);
  res.cookies.set(TOAST_COOKIE, "unauthorized", {
    path: "/",
    httpOnly: false,
    sameSite: "lax",
  });
  return res;
}

export const config = {
  matcher: [
    "/admin/:path*",
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
    "/api-explorer/:path*",
    "/dev-tools/:path*",
    "/profile/:path*",
  ],
};
