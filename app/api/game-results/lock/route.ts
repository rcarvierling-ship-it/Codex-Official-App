import { NextResponse } from "next/server";
import { getSessionServer } from "@/lib/auth";
import { lockGameResult, unlockGameResult } from "@/lib/repos/standings";
import { requireAuth, getAuthRole } from "@/lib/auth-helpers";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  try {
    const session = await requireAuth();
    const role = await getAuthRole();
    
    // Only ADMIN and SUPER_ADMIN can lock/unlock scores
    if (role !== "league_admin") {
      return NextResponse.json(
        { message: "Unauthorized. Only league admins can lock/unlock scores." },
        { status: 403 }
      );
    }
    
    const body = await request.json();
    const { eventId, action } = body; // action: "lock" or "unlock"

    if (!eventId) {
      return NextResponse.json(
        { message: "Event ID is required." },
        { status: 400 }
      );
    }

    const userId = (session.user as any)?.id;
    if (!userId) {
      return NextResponse.json(
        { message: "User ID not found in session." },
        { status: 400 }
      );
    }

    if (action === "lock") {
      await lockGameResult(eventId, userId);
    } else if (action === "unlock") {
      await unlockGameResult(eventId);
    } else {
      return NextResponse.json(
        { message: "Invalid action. Use 'lock' or 'unlock'." },
        { status: 400 }
      );
    }

    revalidatePath("/standings");
    revalidatePath("/events");
    revalidatePath(`/events/${eventId}`);

    return NextResponse.json({ 
      message: `Game result ${action === "lock" ? "locked" : "unlocked"} successfully.` 
    });
  } catch (error: any) {
    console.error("[api/game-results/lock] POST error:", error);
    return NextResponse.json(
      { message: error?.message || "Failed to lock/unlock game result." },
      { status: 500 }
    );
  }
}

