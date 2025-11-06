import { getSessionServer } from "./auth";
import { normalizeRole, type Role } from "@/lib/nav";
import { roleAllows } from "@/lib/acl";
import { redirect } from "next/navigation";

/**
 * Get the current user's role from NextAuth session
 */
export async function getAuthRole(): Promise<Role> {
  const session = await getSessionServer();
  const role = (session?.user as any)?.role;
  return normalizeRole(role ?? "USER");
}

/**
 * Require authentication and return the session
 */
export async function requireAuth() {
  const session = await getSessionServer();
  if (!session) {
    redirect("/(auth)/login");
  }
  return session;
}

/**
 * Require a specific role or higher
 */
export async function requireRole(minRole: Role) {
  const session = await requireAuth();
  const role = normalizeRole((session.user as any)?.role ?? "USER");
  
  const roleHierarchy: Record<Role, number> = {
    SUPER_ADMIN: 6,
    ADMIN: 5,
    AD: 4,
    COACH: 3,
    OFFICIAL: 2,
    USER: 1,
  };

  if (roleHierarchy[role] < roleHierarchy[minRole]) {
    redirect("/");
  }

  return { session, role };
}

/**
 * Check if user can access a path and redirect if not
 */
export async function requirePathAccess(pathname: string) {
  const role = await getAuthRole();
  if (!roleAllows(role, pathname)) {
    // Find an allowed path for this role
    const allowedPaths = ["/admin", "/events", "/profile"];
    const fallback = allowedPaths.find((path) => roleAllows(role, path)) || "/";
    redirect(fallback);
  }
  return role;
}

