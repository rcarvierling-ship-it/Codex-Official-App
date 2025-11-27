import { NextResponse } from "next/server";
import { getSessionServer } from "@/lib/auth";
import { addUserContext } from "@/lib/repos/user-contexts";
import { revalidatePath } from "next/cache";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const session = await getSessionServer();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as any;
    const userId = user?.id;
    if (!userId) {
      return NextResponse.json(
        { message: "User ID not found in session." },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { schoolId, leagueId, role } = body;

    if (!role || typeof role !== "string") {
      return NextResponse.json(
        { message: "role is required." },
        { status: 400 }
      );
    }

    const validRoles = ["fan", "coach", "official", "athletic_director", "school_admin", "league_admin"];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { message: "Invalid role." },
        { status: 400 }
      );
    }

    // At least one of schoolId or leagueId must be provided
    if (!schoolId && !leagueId) {
      return NextResponse.json(
        { message: "Either schoolId or leagueId must be provided." },
        { status: 400 }
      );
    }

    const contextId = await addUserContext(
      userId,
      schoolId || null,
      leagueId || null,
      role
    );

    // Mark onboarding as completed if school or league is assigned
    if (schoolId || leagueId) {
      try {
        const { sql } = await import("@/lib/db");
        await sql`
          UPDATE users
          SET onboarding_completed = true
          WHERE id = ${userId}
        `;
      } catch (error) {
        console.warn("[api/user/add-context] Failed to set onboarding_completed", error);
        // Continue - the column might not exist yet
      }
    }

    revalidatePath("/", "layout");
    revalidatePath("/dashboard");
    revalidatePath("/profile");

    return NextResponse.json({ 
      message: "Context added successfully.", 
      contextId 
    });
  } catch (error: any) {
    console.error("[api/user/add-context] POST failed", error);
    return NextResponse.json(
      { message: error?.message || "Failed to add context." },
      { status: 500 }
    );
  }
}

