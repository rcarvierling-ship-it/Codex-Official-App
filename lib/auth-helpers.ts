import { redirect } from "next/navigation";
import { getSessionServer } from "./auth";
import { normalizeRole, type Role } from "@/lib/nav";
import { roleAllows } from "@/lib/acl";
import { getUserSchool, getUserAccessibleSchoolsAndLeagues } from "@/lib/repos/schools";
import type { SessionUser } from "@/lib/types/auth";

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
  const user = session.user as SessionUser;
  const email = user?.email;
  if (!email) return null;

  const userId = user?.id;
  const role = user?.role;

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
      user.schoolId = membership.schoolId;
      user.school = membership.school ?? null;
    }

    // Attach accessible schools and leagues for filtering
    user.accessibleSchools = accessible?.schoolIds ?? [];
    user.accessibleLeagues = accessible?.leagueIds ?? [];
    user.canSeeAll = accessible === null; // null means league_admin
    
    // Refresh role from database to ensure it's up to date
    if (userId) {
      try {
        const { sql } = await import("@/lib/db");
        const { rows } = await sql<{ role: string | null }>`
          SELECT role FROM users WHERE id = ${userId} LIMIT 1
        `;
        if (rows.length > 0 && rows[0].role) {
          user.role = normalizeRole(rows[0].role);
        }
      } catch (error) {
        console.warn("[auth-helpers] Failed to refresh role from database", error);
      }
    }

    // Check if user has completed onboarding
    if (requireSchool && !membership?.schoolId && accessible?.schoolIds.length === 0) {
      // Check onboarding_completed field first
      const userId = user?.id;
      const email = user?.email;
      const { hasCompletedOnboarding } = await import("@/lib/onboarding-helpers");
      const completed = await hasCompletedOnboarding(userId, email);
      
      if (!completed) {
        // User hasn't completed onboarding, redirect to onboarding
        redirect("/onboarding");
      }
    }

    return membership;
  }

  // Use active context - this is the source of truth for role
  // user is already declared at the top of the function
  if (activeContext.schoolId) {
    user.schoolId = activeContext.schoolId;
    user.school = activeContext.school ?? null;
  }
  if (activeContext.leagueId) {
    user.leagueId = activeContext.leagueId;
    user.league = activeContext.league ?? null;
  }
  // Update session role from active context (most accurate)
  user.role = normalizeRole(activeContext.role);
  user.activeContextId = activeContext.id;

  // Get accessible schools/leagues based on all contexts
  const accessible = await getUserAccessibleSchoolsAndLeagues(email, activeContext.role);
  user.accessibleSchools = accessible?.schoolIds ?? [];
  user.accessibleLeagues = accessible?.leagueIds ?? [];
  user.canSeeAll = accessible === null;

  // Check if user has completed onboarding
  if (requireSchool && !activeContext.schoolId && !activeContext.leagueId && accessible?.schoolIds.length === 0) {
    // Check onboarding_completed field first
    const userId = user?.id;
    const email = user?.email;
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
 * 
 * This function tries multiple sources in order of accuracy:
 * 1. Active user context (most accurate, reflects current school/league context)
 * 2. Database (reflects user's base role)
 * 3. Session (may be stale after role changes)
 * 
 * @returns The normalized role, defaults to "fan" if unable to determine
 */
export async function getAuthRole(): Promise<Role> {
  try {
    const session = await getSessionServer();
    if (!session?.user) {
      console.warn("[auth-helpers] getAuthRole: No session or user, defaulting to 'fan'");
      return normalizeRole("fan");
    }
    
    const user = session.user as SessionUser;
    const userId = user?.id;
    const sessionRole = user?.role;
    
    // Try to get role from active context first (most accurate)
    if (userId) {
      try {
        const { getActiveUserContext } = await import("@/lib/repos/user-contexts");
        const activeContext = await getActiveUserContext(userId);
        if (activeContext?.role) {
          const normalized = normalizeRole(activeContext.role);
          if (normalized !== sessionRole) {
            console.debug(`[auth-helpers] getAuthRole: Role mismatch - context: ${normalized}, session: ${sessionRole}`);
          }
          return normalized;
        }
      } catch (error) {
        console.warn("[auth-helpers] getAuthRole: Failed to get role from context, trying database", error);
      }
      
      // Fallback: fetch role directly from database
      try {
        const { sql } = await import("@/lib/db");
        const { rows } = await sql<{ role: string | null }>`
          SELECT role FROM users WHERE id = ${userId} LIMIT 1
        `;
        if (rows.length > 0 && rows[0].role) {
          const normalized = normalizeRole(rows[0].role);
          if (normalized !== sessionRole) {
            console.debug(`[auth-helpers] getAuthRole: Role mismatch - database: ${normalized}, session: ${sessionRole}`);
          }
          return normalized;
        }
      } catch (error) {
        console.warn("[auth-helpers] getAuthRole: Failed to get role from database, using session role", error);
      }
    }
    
    // Final fallback: use session role
    const normalized = normalizeRole(sessionRole ?? "fan");
    if (!sessionRole) {
      console.warn("[auth-helpers] getAuthRole: No role in session, defaulting to 'fan'");
    }
    return normalized;
  } catch (error) {
    if (!process.env.NEXTAUTH_SECRET) {
      console.warn("[auth-helpers] getAuthRole failed - missing NEXTAUTH_SECRET, defaulting to 'fan'");
      return normalizeRole("fan");
    }
    console.error("[auth-helpers] getAuthRole: Unexpected error", error);
    // Don't throw - return default role to prevent breaking the app
    return normalizeRole("fan");
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
      console.warn("[auth-helpers] requireAuth: No session found, redirecting to login");
      redirect("/login");
    }

    if (!session.user) {
      console.warn("[auth-helpers] requireAuth: Session exists but no user, redirecting to login");
      redirect("/login");
    }

    try {
      await attachSchool(session, requireSchool);
    } catch (attachError) {
      // If attachSchool fails due to onboarding redirect, let it redirect
      if (attachError && typeof attachError === "object" && "digest" in attachError) {
        throw attachError;
      }
      console.error("[auth-helpers] requireAuth: Failed to attach school context", attachError);
      // Continue anyway - some pages don't require school context
    }

    return session;
  } catch (error) {
    // If it's a redirect, let it through
    if (error && typeof error === "object" && "digest" in error) {
      throw error;
    }
    
    if (!process.env.NEXTAUTH_SECRET) {
      console.warn("[auth-helpers] requireAuth failed - missing NEXTAUTH_SECRET, redirecting to login");
      redirect("/login");
    }
    
    console.error("[auth-helpers] requireAuth: Unexpected error", error);
    redirect("/login");
  }
}

/**
 * Require a specific role or higher
 * 
 * @param minRole The minimum role required to access
 * @param options Optional configuration for authentication requirements
 * @returns Session, role, and school information
 * @throws Redirects to home page if user doesn't have required role
 */
export async function requireRole(minRole: Role, options?: RequireAuthOptions) {
  try {
    const session = await requireAuth(options);
    const role = await getAuthRole(); // Use getAuthRole to get the most accurate role

    const roleHierarchy: Record<Role, number> = {
      league_admin: 6,
      school_admin: 5,
      athletic_director: 4,
      coach: 3,
      official: 2,
      fan: 1,
    };

    const userRoleLevel = roleHierarchy[role] ?? 0;
    const requiredLevel = roleHierarchy[minRole] ?? 0;

    if (userRoleLevel < requiredLevel) {
      console.warn(
        `[auth-helpers] requireRole: Access denied - user role '${role}' (level ${userRoleLevel}) does not meet required '${minRole}' (level ${requiredLevel})`
      );
      redirect("/");
    }

    const user = session.user as SessionUser;
    return { session, role, school: user?.school ?? null };
  } catch (error) {
    // If it's a redirect, let it through
    if (error && typeof error === "object" && "digest" in error) {
      throw error;
    }
    console.error("[auth-helpers] requireRole: Unexpected error", error);
    redirect("/");
  }
}

/**
 * Require owner access - only the owner email can access
 */
export async function requireOwner() {
  const session = await requireAuth({ requireSchool: false });
  const user = session.user as SessionUser;
  const email = user?.email;
  
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
  const role = await getAuthRole(); // Use getAuthRole to get the most accurate role
  if (!roleAllows(role, pathname)) {
    const allowedPaths = ["/admin", "/events", "/profile"];
    const fallback = allowedPaths.find((path) => roleAllows(role, path)) || "/";
    redirect(fallback);
  }
  return role;
}
