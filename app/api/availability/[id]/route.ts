import { NextResponse } from "next/server";
import { getSessionServer } from "@/lib/auth";
import {
  updateAvailabilityBlock,
  deleteAvailabilityBlock,
  getAvailabilityBlocks,
} from "@/lib/repos/availability";
import { revalidatePath } from "next/cache";
import type { SessionUser } from "@/lib/types/auth";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSessionServer();
    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    const user = session.user as SessionUser;
    const userId = user.id;
    if (!userId) {
      return NextResponse.json(
        { message: "User ID not found in session." },
        { status: 400 }
      );
    }

    // Verify the block belongs to this user
    const blocks = await getAvailabilityBlocks(userId);
    const block = blocks.find((b) => b.id === params.id);
    if (!block) {
      return NextResponse.json(
        { message: "Availability block not found or access denied." },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { startTime, endTime, isAvailable, notes } = body;

    let start: Date | undefined;
    let end: Date | undefined;

    if (startTime) {
      start = new Date(startTime);
      if (isNaN(start.getTime())) {
        return NextResponse.json(
          { message: "Invalid start date format." },
          { status: 400 }
        );
      }
    }

    if (endTime) {
      end = new Date(endTime);
      if (isNaN(end.getTime())) {
        return NextResponse.json(
          { message: "Invalid end date format." },
          { status: 400 }
        );
      }
    }

    if (start && end && start >= end) {
      return NextResponse.json(
        { message: "Start time must be before end time." },
        { status: 400 }
      );
    }

    await updateAvailabilityBlock(
      params.id,
      start,
      end,
      isAvailable !== undefined ? Boolean(isAvailable) : undefined,
      notes !== undefined ? notes : undefined
    );

    revalidatePath("/assignments");
    revalidatePath("/dashboard");

    return NextResponse.json({ message: "Availability block updated successfully." });
  } catch (error: any) {
    console.error("[api/availability] PATCH error:", error);
    return NextResponse.json(
      { message: error?.message || "Failed to update availability block." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSessionServer();
    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    const user = session.user as SessionUser;
    const userId = user.id;
    if (!userId) {
      return NextResponse.json(
        { message: "User ID not found in session." },
        { status: 400 }
      );
    }

    // Verify the block belongs to this user
    const blocks = await getAvailabilityBlocks(userId);
    const block = blocks.find((b) => b.id === params.id);
    if (!block) {
      return NextResponse.json(
        { message: "Availability block not found or access denied." },
        { status: 404 }
      );
    }

    await deleteAvailabilityBlock(params.id);

    revalidatePath("/assignments");
    revalidatePath("/dashboard");

    return NextResponse.json({ message: "Availability block deleted successfully." });
  } catch (error: any) {
    console.error("[api/availability] DELETE error:", error);
    return NextResponse.json(
      { message: error?.message || "Failed to delete availability block." },
      { status: 500 }
    );
  }
}

