import { NextResponse } from "next/server";
import { getSessionServer } from "@/lib/auth";
import { updateGameChangeRequestStatus, type ChangeRequestStatus } from "@/lib/repos/game-change-requests";
import { revalidatePath } from "next/cache";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSessionServer();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as any;
    const userId = user?.id;
    const role = user?.role;

    // Only ADs and admins can approve/deny
    if (role !== "athletic_director" && role !== "league_admin") {
      return NextResponse.json(
        { message: "Only Athletic Directors and Administrators can approve/deny change requests." },
        { status: 403 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { message: "User ID not found in session." },
        { status: 400 }
      );
    }

    const { id } = params;
    const body = await request.json();
    const { status } = body;

    if (!status || (status !== "APPROVED" && status !== "DENIED")) {
      return NextResponse.json(
        { message: "status must be 'APPROVED' or 'DENIED'." },
        { status: 400 }
      );
    }

    await updateGameChangeRequestStatus(id, status as ChangeRequestStatus, userId);

    revalidatePath("/dashboard");
    revalidatePath("/approvals");
    revalidatePath("/events");

    return NextResponse.json({ message: "Change request updated successfully." });
  } catch (error: any) {
    console.error("[api/game-change-requests] PATCH failed", error);
    return NextResponse.json(
      { message: error?.message || "Failed to update change request." },
      { status: 500 }
    );
  }
}

