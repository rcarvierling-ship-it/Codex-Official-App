import { NextResponse } from "next/server";
import { getSessionServer } from "@/lib/auth";
import { sql } from "@/lib/db";
import type { SessionUser } from "@/lib/types/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Mark onboarding as complete
 * This sets onboarding_completed = true in the users table
 */
export async function POST(request: Request) {
  try {
    const session = await getSessionServer();
    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = session.user as SessionUser;
    const userId = user.id;
    const email = user.email;

    if (!userId && !email) {
      return NextResponse.json(
        { message: "User ID or email required" },
        { status: 400 }
      );
    }

    // Update onboarding_completed to true
    try {
      if (userId) {
        await sql`
          UPDATE users
          SET onboarding_completed = true
          WHERE id = ${userId}
        `;
      } else if (email) {
        await sql`
          UPDATE users
          SET onboarding_completed = true
          WHERE email = ${email}
        `;
      }
    } catch (error) {
      // If column doesn't exist yet, try to add it (for migration)
      console.warn("[api/onboarding/complete] Column may not exist, attempting migration", error);
      try {
        await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false`;
        // Retry the update
        if (userId) {
          await sql`
            UPDATE users
            SET onboarding_completed = true
            WHERE id = ${userId}
          `;
        } else if (email) {
          await sql`
            UPDATE users
            SET onboarding_completed = true
            WHERE email = ${email}
          `;
        }
      } catch (migrationError) {
        console.error("[api/onboarding/complete] Migration failed", migrationError);
        // Continue anyway - the check will use school membership as fallback
      }
    }

    // Get updated user data
    let userData = null;
    try {
      if (userId) {
        const { rows } = await sql<{ id: string; role: string; onboarding_completed: boolean }>`
          SELECT id, role, onboarding_completed
          FROM users
          WHERE id = ${userId}
          LIMIT 1
        `;
        userData = rows[0];
      } else if (email) {
        const { rows } = await sql<{ id: string; role: string; onboarding_completed: boolean }>`
          SELECT id, role, onboarding_completed
          FROM users
          WHERE email = ${email}
          LIMIT 1
        `;
        userData = rows[0];
      }
    } catch (error) {
      console.warn("[api/onboarding/complete] Failed to fetch user data", error);
    }

    return NextResponse.json({ 
      ok: true,
      completed: true,
      user: userData,
      message: "Onboarding completed successfully"
    });
  } catch (error: any) {
    console.error("[api/onboarding/complete] POST error:", error);
    return NextResponse.json(
      { message: error?.message || "Failed to complete onboarding." },
      { status: 500 }
    );
  }
}

/**
 * Check if user has completed onboarding
 */
export async function GET() {
  try {
    const session = await getSessionServer();
    if (!session?.user) {
      return NextResponse.json(
        { completed: false },
        { status: 401 }
      );
    }

    const user = session.user as SessionUser;
    const userId = user.id;
    const email = user.email;

    if (!userId && !email) {
      return NextResponse.json({ completed: false });
    }

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
      } else {
        const result = await sql<{ onboarding_completed: boolean }>`
          SELECT onboarding_completed
          FROM users
          WHERE email = ${email}
          LIMIT 1
        `;
        rows = result.rows;
      }

      if (rows.length > 0) {
        return NextResponse.json({ completed: rows[0].onboarding_completed === true });
      }
    } catch (error) {
      // Column might not exist, fall back to checking school membership
      console.warn("[api/onboarding/complete] GET error, falling back to school check", error);
      const { hasCompletedOnboarding } = await import("@/lib/onboarding-helpers");
      const completed = await hasCompletedOnboarding(userId, email);
      return NextResponse.json({ completed });
    }

    return NextResponse.json({ completed: false });
  } catch (error: any) {
    console.error("[api/onboarding/complete] GET error:", error);
    return NextResponse.json(
      { completed: false },
      { status: 500 }
    );
  }
}
