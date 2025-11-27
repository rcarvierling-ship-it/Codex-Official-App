"use server";

import { getSessionServer } from "@/lib/auth";
import { assignUserToSchool, createSchool, getSchoolById } from "@/lib/repos/schools";
import { sql } from "@/lib/db";
import { addUserContext } from "@/lib/repos/user-contexts";
import { getRoleDashboardPath } from "@/lib/onboarding-redirect";
import { normalizeRole } from "@/lib/nav";

export type OnboardingResult = {
  success: boolean;
  error?: string;
  user?: {
    id: string;
    role: string;
    schoolId?: string;
  };
  redirectPath?: string;
};

/**
 * Server action to complete onboarding by joining an existing school
 */
export async function completeOnboardingJoinSchool(
  schoolId: string,
  role: string
): Promise<OnboardingResult> {
  try {
    const session = await getSessionServer();
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const userId = (session.user as any)?.id;
    const email = (session.user as any)?.email;

    if (!email) {
      return { success: false, error: "Email not found in session" };
    }

    // Validate school exists
    const school = await getSchoolById(schoolId);
    if (!school) {
      return { success: false, error: "School not found" };
    }

    // Normalize role
    const normalizedRole = normalizeRole(role);

    // Assign user to school (legacy support)
    await assignUserToSchool(email, school.id);

    // Create context for this school/role combination
    if (userId) {
      try {
        await addUserContext(userId, schoolId, null, normalizedRole);
      } catch (err) {
        console.warn("[completeOnboardingJoinSchool] Failed to create context", err);
        // Continue anyway
      }
    }

    // Update user role
    try {
      if (userId) {
        await sql`
          UPDATE users
          SET role = ${normalizedRole}, onboarding_completed = true
          WHERE id = ${userId}
        `;
      } else {
        await sql`
          UPDATE users
          SET role = ${normalizedRole}, onboarding_completed = true
          WHERE email = ${email}
        `;
      }
    } catch (err) {
      console.warn("[completeOnboardingJoinSchool] Failed to update role/onboarding", err);
      // Try to add column if it doesn't exist
      try {
        await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false`;
        // Retry update
        if (userId) {
          await sql`
            UPDATE users
            SET role = ${normalizedRole}, onboarding_completed = true
            WHERE id = ${userId}
          `;
        } else {
          await sql`
            UPDATE users
            SET role = ${normalizedRole}, onboarding_completed = true
            WHERE email = ${email}
          `;
        }
      } catch (migrationErr) {
        console.error("[completeOnboardingJoinSchool] Migration failed", migrationErr);
      }
    }

    // Get redirect path based on role
    const redirectPath = getRoleDashboardPath(normalizedRole);

    return {
      success: true,
      user: {
        id: userId || "",
        role: normalizedRole,
        schoolId: school.id,
      },
      redirectPath,
    };
  } catch (error: any) {
    console.error("[completeOnboardingJoinSchool] Error:", error);
    return {
      success: false,
      error: error?.message || "Failed to complete onboarding",
    };
  }
}

/**
 * Server action to complete onboarding by creating a new school
 */
export async function completeOnboardingCreateSchool(
  schoolName: string,
  role: string,
  leagueId?: string | null
): Promise<OnboardingResult> {
  try {
    const session = await getSessionServer();
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const userId = (session.user as any)?.id;
    const email = (session.user as any)?.email;

    if (!email) {
      return { success: false, error: "Email not found in session" };
    }

    // Normalize role
    const normalizedRole = normalizeRole(role);

    // Create school
    const school = await createSchool(schoolName.trim(), leagueId || null);
    if (!school) {
      return { success: false, error: "Failed to create school" };
    }

    // Assign user to school (legacy support)
    await assignUserToSchool(email, school.id);

    // Create context for this school/role combination
    if (userId) {
      try {
        await addUserContext(userId, school.id, null, normalizedRole);
      } catch (err) {
        console.warn("[completeOnboardingCreateSchool] Failed to create context", err);
        // Continue anyway
      }
    }

    // Update user role and mark onboarding as completed
    try {
      if (userId) {
        await sql`
          UPDATE users
          SET role = ${normalizedRole}, onboarding_completed = true
          WHERE id = ${userId}
        `;
      } else {
        await sql`
          UPDATE users
          SET role = ${normalizedRole}, onboarding_completed = true
          WHERE email = ${email}
        `;
      }
    } catch (err) {
      console.warn("[completeOnboardingCreateSchool] Failed to update role/onboarding", err);
      // Try to add column if it doesn't exist
      try {
        await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false`;
        // Retry update
        if (userId) {
          await sql`
            UPDATE users
            SET role = ${normalizedRole}, onboarding_completed = true
            WHERE id = ${userId}
          `;
        } else {
          await sql`
            UPDATE users
            SET role = ${normalizedRole}, onboarding_completed = true
            WHERE email = ${email}
          `;
        }
      } catch (migrationErr) {
        console.error("[completeOnboardingCreateSchool] Migration failed", migrationErr);
      }
    }

    // Get redirect path based on role
    const redirectPath = getRoleDashboardPath(normalizedRole);

    return {
      success: true,
      user: {
        id: userId || "",
        role: normalizedRole,
        schoolId: school.id,
      },
      redirectPath,
    };
  } catch (error: any) {
    console.error("[completeOnboardingCreateSchool] Error:", error);
    return {
      success: false,
      error: error?.message || "Failed to complete onboarding",
    };
  }
}

