import "server-only";
import { getUserSchool } from "@/lib/repos/schools";
import { sql } from "@/lib/db";

// Note: This file is used in Edge Middleware, so it must not import Node.js-only modules

/**
 * Check if a user has completed onboarding
 * A user has completed onboarding if:
 * - onboarding_completed = true in users table (primary check)
 * - OR they have a school assigned (via user_school_roles or user_profiles) (fallback)
 * - OR they have a league assigned (via user_school_roles) (fallback)
 */
export async function hasCompletedOnboarding(userId: string | null, email: string | null): Promise<boolean> {
  if (!userId && !email) return false;

  try {
    // First check onboarding_completed field in users table
    try {
      let rows;
      if (userId) {
        const result = await sql<{ onboarding_completed: boolean }>`
          SELECT onboarding_completed
          FROM users
          WHERE id = ${userId}
          LIMIT 1
        `;
        rows = result.rows;
      } else if (email) {
        const result = await sql<{ onboarding_completed: boolean }>`
          SELECT onboarding_completed
          FROM users
          WHERE email = ${email}
          LIMIT 1
        `;
        rows = result.rows;
      }

      if (rows && rows.length > 0) {
        // Column exists and we got a result
        if (rows[0].onboarding_completed === true) {
          return true;
        }
        // If explicitly false, return false (don't fall back to school check)
        if (rows[0].onboarding_completed === false) {
          return false;
        }
      }
    } catch (error) {
      // Column might not exist yet, fall through to school/league check
      console.warn("[onboarding-helpers] onboarding_completed column may not exist", error);
    }

    // Fallback: Check new context system (user_school_roles)
    if (userId) {
      try {
        const { rows } = await sql<{ count: number }>`
          SELECT COUNT(*) as count
          FROM user_school_roles
          WHERE user_id = ${userId}
            AND (school_id IS NOT NULL OR league_id IS NOT NULL)
          LIMIT 1
        `;
        if (rows[0]?.count && Number(rows[0].count) > 0) {
          return true;
        }
      } catch (error) {
        console.warn("[onboarding-helpers] Failed to check user_school_roles", error);
      }
    }

    // Fallback: Check legacy system (user_profiles or users.active_school_id)
    if (email) {
      const membership = await getUserSchool(email);
      if (membership?.schoolId) {
        return true;
      }
    }

    return false;
  } catch (error) {
    console.error("[onboarding-helpers] hasCompletedOnboarding failed", error);
    return false;
  }
}

/**
 * Get user role consistently
 * Checks both the session role and the active context role
 */
export async function getUserRole(userId: string | null, sessionRole: string | null): Promise<string> {
  if (!userId) {
    return sessionRole || "fan";
  }

  try {
    // Try to get role from active context
    const { rows } = await sql<{ role: string }>`
      SELECT role
      FROM user_school_roles
      WHERE user_id = ${userId} AND is_active = true
      LIMIT 1
    `;
    if (rows.length > 0) {
      return rows[0].role || sessionRole || "fan";
    }
  } catch (error) {
    console.warn("[onboarding-helpers] Failed to get role from context", error);
  }

  return sessionRole || "fan";
}

