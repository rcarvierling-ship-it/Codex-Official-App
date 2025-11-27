import { NextResponse } from "next/server";
import { getSessionServer } from "@/lib/auth";
import { verifyGameResult } from "@/lib/repos/standings";
import { revalidatePath } from "next/cache";

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
    const { eventId } = body;

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

    await verifyGameResult(eventId, userId);

    revalidatePath("/standings");
    revalidatePath("/events");
    revalidatePath(`/events/${eventId}`);

    return NextResponse.json({ message: "Game result verified successfully." });
  } catch (error: any) {
    console.error("[api/game-results/verify] POST error:", error);
    return NextResponse.json(
      { message: error?.message || "Failed to verify game result." },
      { status: 500 }
    );
  }
}

