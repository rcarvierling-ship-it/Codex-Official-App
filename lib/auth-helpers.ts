import { redirect } from "next/navigation";
import { getSessionServer } from "./auth";
import { normalizeRole, type Role } from "@/lib/nav";
import { roleAllows } from "@/lib/acl";
import { getUserSchool, getUserAccessibleSchoolsAndLeagues } from "@/lib/repos/schools";

type RequireAuthOptions = {
  requireSchool?: boolean;
};

const warnMissingSecret = () => {
  if (!process.env.NEXTAUTH_SECRET && process.env.NODE_ENV === "production") {
    console.warn(
      "[auth-helpers] NEXTAUTH_SECRET is missing. Authentication may not work correctly in production."
    );
  }
};

warnMissingSecret();

async function attachSchool(session: any, requireSchool: boolean) {
  if (!session?.user) return null;
  const email = (session.user as any)?.email;
  if (!email) return null;

  const role = (session.user as any)?.role;
  const membership = await getUserSchool(email);
  const accessible = await getUserAccessibleSchoolsAndLeagues(email, role);

  if (membership?.schoolId) {
    (session.user as any).schoolId = membership.schoolId;
    (session.user as any).school = membership.school ?? null;
  }

  // Attach accessible schools and leagues for filtering
  (session.user as any).accessibleSchools = accessible?.schoolIds ?? [];
  (session.user as any).accessibleLeagues = accessible?.leagueIds ?? [];
  (session.user as any).canSeeAll = accessible === null; // null means SUPER_ADMIN/ADMIN

  if (requireSchool && !membership?.schoolId && accessible?.schoolIds.length === 0) {
    redirect("/onboarding");
  }

  return membership;
}

/**
 * Get the current user's role from NextAuth session
 */
export async function getAuthRole(): Promise<Role> {
  try {
    const session = await getSessionServer();
    const role = (session?.user as any)?.role;
    return normalizeRole(role ?? "USER");
  } catch (error) {
    if (!process.env.NEXTAUTH_SECRET) {
      console.warn("[auth-helpers] getAuthRole failed - missing NEXTAUTH_SECRET");
      return normalizeRole("USER");
    }
    throw error;
  }
}

/**
 * Require authentication and return the session
 */
export async function requireAuth(options: RequireAuthOptions = {}) {
  const { requireSchool = true } = options;
  try {
    const session = await getSessionServer();
    if (!session) {
      redirect("/(auth)/login");
    }

    await attachSchool(session, requireSchool);
    return session;
  } catch (error) {
    if (!process.env.NEXTAUTH_SECRET) {
      console.warn("[auth-helpers] requireAuth failed - missing NEXTAUTH_SECRET, redirecting to login");
      redirect("/(auth)/login");
    }
    throw error;
  }
}

/**
 * Require a specific role or higher
 */
export async function requireRole(minRole: Role, options?: RequireAuthOptions) {
  const session = await requireAuth(options);
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

  return { session, role, school: (session.user as any)?.school ?? null };
}

/**
 * Check if user can access a path and redirect if not
 */
export async function requirePathAccess(pathname: string) {
  const session = await requireAuth();
  const role = normalizeRole((session.user as any)?.role ?? "USER");
  if (!roleAllows(role, pathname)) {
    const allowedPaths = ["/admin", "/events", "/profile"];
    const fallback = allowedPaths.find((path) => roleAllows(role, path)) || "/";
    redirect(fallback);
  }
  return role;
}
