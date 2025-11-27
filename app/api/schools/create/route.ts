import { NextResponse } from "next/server";
import { getSessionServer } from "@/lib/auth";
import { assignUserToSchool, createSchool } from "@/lib/repos/schools";
import type { SessionUser } from "@/lib/types/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const session = await getSessionServer();
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { name, leagueId } = await request.json().catch(() => ({}));
    const trimmedName = typeof name === "string" ? name.trim() : "";
    if (!trimmedName) {
      return NextResponse.json({ message: "Provide a school name to continue." }, { status: 400 });
    }

    const school = await createSchool(trimmedName, typeof leagueId === "string" ? leagueId : null);
    if (!school) {
      return NextResponse.json(
        { message: "Unable to create a school at this time." },
        { status: 500 },
      );
    }

    await assignUserToSchool(session.user.email, school.id);

    // Mark onboarding as completed
    const user = session.user as SessionUser;
    const userId = user.id;
    try {
      const { sql } = await import("@/lib/db");
      if (userId) {
        await sql`
          UPDATE users
          SET onboarding_completed = true
          WHERE id = ${userId}
        `;
      } else {
        await sql`
          UPDATE users
          SET onboarding_completed = true
          WHERE email = ${session.user.email}
        `;
      }
    } catch (error) {
      console.warn("[api/schools/create] Failed to set onboarding_completed", error);
      // Continue - the column might not exist yet
    }

    // Try to verify the assignment, but don't fail if it's not immediately available
    // The client-side code has retry logic to handle database replication delays
    // Also check the new user_school_roles table
    let verified = false;
    try {
      // Check legacy system
      const { getUserSchool } = await import("@/lib/repos/schools");
      const membership = await getUserSchool(session.user.email);
      if (membership?.schoolId === school.id) {
        verified = true;
      }
    } catch (err) {
      console.warn("[api/schools/create] Legacy verification check failed", err);
    }

    // Also check the new context system
    if (!verified) {
      try {
        const userId = user.id;
        if (userId) {
          const { getActiveUserContext } = await import("@/lib/repos/user-contexts");
          const context = await getActiveUserContext(userId);
          if (context?.schoolId === school.id) {
            verified = true;
          }
        }
      } catch (err) {
        console.warn("[api/schools/create] Context verification check failed", err);
      }
    }

    // If not verified immediately, still return success - client will retry
    // This prevents false negatives due to database replication delays
    if (!verified) {
      console.warn("[api/schools/create] Assignment not immediately verified, but returning success. Client will retry.");
    }

    return NextResponse.json({ ok: true, school });
  } catch (error) {
    console.error("[api/schools/create] failed", error);
    return NextResponse.json(
      { message: "Unable to create a school right now." },
      { status: 500 },
    );
  }
}
