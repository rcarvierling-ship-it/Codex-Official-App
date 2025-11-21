import { getAllNavPaths, getNavForRole, type Role } from "./nav";

const alwaysAllowed = new Set(["/", "/demo"]);

export function pathMatches(base: string, pathname: string) {
  if (base === "/") return pathname === "/";
  if (!base.startsWith("/")) return false;
  return pathname === base || pathname.startsWith(`${base}/`);
}

export function roleAllows(role: Role, pathname: string): boolean {
  if (alwaysAllowed.has(pathname)) return true;
  const allowed = getNavForRole(role);
  return allowed.some((item) => pathMatches(item.href, pathname));
}

const PROTECTED_BASE_PATHS = Array.from(
  new Set([
    "/admin",
    "/events",
    "/officials",
    "/requests",
    "/approvals",
    "/assignments",
    "/announcements",
    "/teams",
    "/venues",
    "/admin/leagues",
    "/admin/schools",
    "/admin/teams",
    "/admin/venues",
    "/admin/users",
    "/admin/feature-flags",
    "/admin/settings",
    "/analytics",
    "/activity",
    "/api-explorer",
    "/dev-tools",
    "/profile",
  ]),
);

getAllNavPaths().forEach((path) => PROTECTED_BASE_PATHS.push(path));

export const GUARDED_PREFIXES = Array.from(new Set(PROTECTED_BASE_PATHS));
