import { NextResponse } from "next/server";
import { getSessionServer } from "@/lib/auth";
import { upsertGameResult } from "@/lib/repos/standings";
import { revalidatePath } from "next/cache";
import type { SessionUser } from "@/lib/types/auth";

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
    const { eventId, teamHomeId, teamAwayId, homeScore, awayScore, status } = body;

    if (!eventId || !teamHomeId || !teamAwayId) {
      return NextResponse.json(
        { message: "Event ID, home team ID, and away team ID are required." },
        { status: 400 }
      );
    }

    const user = session.user as SessionUser;
    const userId = user.id;

    const resultId = await upsertGameResult(
      eventId,
      teamHomeId,
      teamAwayId,
      homeScore || null,
      awayScore || null,
      status || "COMPLETED",
      userId
    );

    revalidatePath("/standings");
    revalidatePath("/events");
    revalidatePath(`/events/${eventId}`);

    return NextResponse.json(
      { message: "Game result saved successfully.", id: resultId },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("[api/game-results] POST error:", error);
    return NextResponse.json(
      { message: error?.message || "Failed to save game result." },
      { status: 500 }
    );
  }
}

