import { NextResponse } from "next/server";
import { getSessionServer } from "@/lib/auth";
import {
  getAvailabilityBlocks,
  createAvailabilityBlock,
} from "@/lib/repos/availability";
import { revalidatePath } from "next/cache";

export async function GET(request: Request) {
  try {
    const session = await getSessionServer();
    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    const userId = (session.user as any)?.id;
    if (!userId) {
      return NextResponse.json(
        { message: "User ID not found in session." },
        { status: 400 }
      );
    }

    // Get optional date range from query params
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const blocks = await getAvailabilityBlocks(
      userId,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined
    );

    return NextResponse.json({ blocks });
  } catch (error: any) {
    console.error("[api/availability] GET error:", error);
    return NextResponse.json(
      { message: error?.message || "Failed to fetch availability blocks." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSessionServer();
    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    const userId = (session.user as any)?.id;
    if (!userId) {
      return NextResponse.json(
        { message: "User ID not found in session." },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { startTime, endTime, isAvailable, notes } = body;

    if (!startTime || !endTime) {
      return NextResponse.json(
        { message: "Start time and end time are required." },
        { status: 400 }
      );
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return NextResponse.json(
        { message: "Invalid date format." },
        { status: 400 }
      );
    }

    if (start >= end) {
      return NextResponse.json(
        { message: "Start time must be before end time." },
        { status: 400 }
      );
    }

    const blockId = await createAvailabilityBlock(
      userId,
      start,
      end,
      isAvailable !== undefined ? Boolean(isAvailable) : true,
      notes || null
    );

    revalidatePath("/assignments");
    revalidatePath("/dashboard");

    return NextResponse.json(
      { message: "Availability block created successfully.", id: blockId },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("[api/availability] POST error:", error);
    return NextResponse.json(
      { message: error?.message || "Failed to create availability block." },
      { status: 500 }
    );
  }
}

