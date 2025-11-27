import { NextResponse } from "next/server";
import { getSessionServer } from "@/lib/auth";
import {
  getGameChangeRequests,
  createGameChangeRequest,
  type ChangeType,
} from "@/lib/repos/game-change-requests";
import { revalidatePath } from "next/cache";
import type { SessionUser } from "@/lib/types/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const session = await getSessionServer();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as SessionUser;
    const userId = user.id;
    const role = user.role;
    const accessibleSchools = user.accessibleSchools ?? [];
    const canSeeAll = user.canSeeAll ?? false;

    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get("eventId");
    const status = searchParams.get("status") as any;

    const filters: any = {};
    if (eventId) filters.eventId = eventId;
    if (status) filters.status = status;

    // Coaches can only see their own requests
    if (role === "coach" && userId) {
      filters.requestedBy = userId;
    }
    // ADs and admins can see all requests for their schools
    else if ((role === "athletic_director" || role === "school_admin" || role === "league_admin") && !canSeeAll) {
      filters.schoolIds = accessibleSchools;
    }

    const requests = await getGameChangeRequests(filters);

    return NextResponse.json({ requests });
  } catch (error: any) {
    console.error("[api/game-change-requests] GET failed", error);
    return NextResponse.json(
      { message: error?.message || "Failed to fetch change requests." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSessionServer();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as SessionUser;
    const userId = user.id;
    const role = user.role;

    // Only coaches can create change requests
    if (role !== "coach") {
      return NextResponse.json(
        { message: "Only coaches can create game change requests." },
        { status: 403 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { message: "User ID not found in session." },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { eventId, changeType, currentValue, requestedValue, reason } = body;

    if (!eventId || !changeType) {
      return NextResponse.json(
        { message: "eventId and changeType are required." },
        { status: 400 }
      );
    }

    const validChangeTypes: ChangeType[] = [
      "TIME",
      "LOCATION",
      "OPPONENT",
      "CANCELLATION",
      "POSTPONEMENT",
    ];
    if (!validChangeTypes.includes(changeType)) {
      return NextResponse.json(
        { message: "Invalid change type." },
        { status: 400 }
      );
    }

    const requestId = await createGameChangeRequest(
      eventId,
      userId,
      changeType,
      currentValue || null,
      requestedValue || null,
      reason || null
    );

    revalidatePath("/dashboard");
    revalidatePath("/approvals");
    revalidatePath("/events");

    return NextResponse.json(
      { message: "Change request created successfully.", id: requestId },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("[api/game-change-requests] POST failed", error);
    return NextResponse.json(
      { message: error?.message || "Failed to create change request." },
      { status: 500 }
    );
  }
}

