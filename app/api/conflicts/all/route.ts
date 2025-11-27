import { NextResponse } from "next/server";
import { getSessionServer } from "@/lib/auth";
import { requireAuth, getAuthRole } from "@/lib/auth-helpers";
import { getAllConflicts } from "@/lib/repos/conflicts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await requireAuth();
    const role = await getAuthRole();
    
    // Only league_admin can view all conflicts
    if (role !== "league_admin") {
      return NextResponse.json(
        { message: "Unauthorized. Only admins can view all conflicts." },
        { status: 403 }
      );
    }

    const conflicts = await getAllConflicts();

    return NextResponse.json({ conflicts });
  } catch (error: any) {
    console.error("[api/conflicts/all] GET error:", error);
    return NextResponse.json(
      { message: error?.message || "Failed to fetch conflicts." },
      { status: 500 }
    );
  }
}

