import { NextResponse } from "next/server";
import { getSessionServer } from "@/lib/auth";
import { checkAllConflicts } from "@/lib/repos/conflicts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const session = await getSessionServer();
    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      eventId,
      venueId,
      teamHomeId,
      teamAwayId,
      startTime,
      endTime,
      assignedReferees,
      coachUserIds,
    } = body;

    if (!startTime) {
      return NextResponse.json(
        { message: "Start time is required." },
        { status: 400 }
      );
    }

    const conflicts = await checkAllConflicts({
      eventId,
      venueId: venueId || null,
      teamHomeId: teamHomeId || null,
      teamAwayId: teamAwayId || null,
      startTime,
      endTime: endTime || undefined,
      assignedReferees: assignedReferees || [],
      coachUserIds: coachUserIds || [],
    });

    return NextResponse.json({ conflicts });
  } catch (error: any) {
    console.error("[api/conflicts/check] POST error:", error);
    return NextResponse.json(
      { message: error?.message || "Failed to check conflicts." },
      { status: 500 }
    );
  }
}

