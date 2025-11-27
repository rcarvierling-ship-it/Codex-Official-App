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

  const userId = (session.user as any)?.id;
  const role = (session.user as any)?.role;

  // Try to get active context from user_school_roles first
  let activeContext = null;
  if (userId) {
    try {
      const { getActiveUserContext } = await import("@/lib/repos/user-contexts");
      activeContext = await getActiveUserContext(userId);
    } catch (error) {
      console.warn("[auth-helpers] Failed to get active context, falling back to legacy method", error);
    }
  }

  // Fallback to legacy method if no context system
  if (!activeContext) {
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

    // Check if user has completed onboarding
    if (requireSchool && !membership?.schoolId && accessible?.schoolIds.length === 0) {
      // Check onboarding_completed field first
      const userId = (session.user as any)?.id;
      const email = (session.user as any)?.email;
      const { hasCompletedOnboarding } = await import("@/lib/onboarding-helpers");
      const completed = await hasCompletedOnboarding(userId, email);
      
      if (!completed) {
        // User hasn't completed onboarding, redirect to onboarding
        redirect("/onboarding");
      }
    }

    return membership;
  }

  // Use active context
  if (activeContext.schoolId) {
    (session.user as any).schoolId = activeContext.schoolId;
    (session.user as any).school = activeContext.school ?? null;
  }
  if (activeContext.leagueId) {
    (session.user as any).leagueId = activeContext.leagueId;
    (session.user as any).league = activeContext.league ?? null;
  }
  (session.user as any).role = activeContext.role;
  (session.user as any).activeContextId = activeContext.id;

  // Get accessible schools/leagues based on all contexts
  const accessible = await getUserAccessibleSchoolsAndLeagues(email, activeContext.role);
  (session.user as any).accessibleSchools = accessible?.schoolIds ?? [];
  (session.user as any).accessibleLeagues = accessible?.leagueIds ?? [];
  (session.user as any).canSeeAll = accessible === null;

  // Check if user has completed onboarding
  if (requireSchool && !activeContext.schoolId && !activeContext.leagueId && accessible?.schoolIds.length === 0) {
    // Check onboarding_completed field first
    const userId = (session.user as any)?.id;
    const email = (session.user as any)?.email;
    const { hasCompletedOnboarding } = await import("@/lib/onboarding-helpers");
    const completed = await hasCompletedOnboarding(userId, email);
    
    if (!completed) {
      // User hasn't completed onboarding, redirect to onboarding
      redirect("/onboarding");
    }
  }

  return {
    schoolId: activeContext.schoolId,
    school: activeContext.school,
  };
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
    league_admin: 6,
    school_admin: 5,
    athletic_director: 4,
    coach: 3,
    official: 2,
    fan: 1,
  };

  if (roleHierarchy[role] < roleHierarchy[minRole]) {
    redirect("/");
  }

  return { session, role, school: (session.user as any)?.school ?? null };
}

/**
 * Require owner access - only the owner email can access
 */
export async function requireOwner() {
  const session = await requireAuth({ requireSchool: false });
  const email = (session.user as any)?.email;
  
  const ownerEmail = process.env.OWNER_EMAIL?.toLowerCase().trim();
  if (!ownerEmail) {
    console.error("[auth-helpers] OWNER_EMAIL environment variable is not set");
    throw new Error("OWNER_EMAIL environment variable is not configured. Please set it in your environment variables.");
  }

  if (!email || email.toLowerCase().trim() !== ownerEmail) {
    console.warn(`[auth-helpers] Access denied: ${email} does not match OWNER_EMAIL (${ownerEmail})`);
    throw new Error("Access denied. This page is only accessible to the owner.");
  }

  return session;
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
