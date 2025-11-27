import { NextResponse } from "next/server";
import { getSessionServer } from "@/lib/auth";
import { createRequest } from "@/lib/repos/requests";
import { sql } from "@/lib/db";
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
    const { eventId, message } = body;

    if (!eventId) {
      return NextResponse.json(
        { message: "Event ID is required." },
        { status: 400 }
      );
    }

    // Get user ID from session or look it up by email
    let userId = (session.user as any)?.id;
    if (!userId) {
      // Fallback: look up user by email
      const email = (session.user as any)?.email;
      if (!email) {
        return NextResponse.json(
          { message: "User ID not found in session." },
          { status: 400 }
        );
      }
      const { rows } = await sql<{ id: string }>`
        SELECT id FROM users WHERE email = ${email} LIMIT 1
      `;
      if (rows.length === 0) {
        return NextResponse.json(
          { message: "User not found." },
          { status: 404 }
        );
      }
      userId = rows[0].id;
    }

    const requestId = await createRequest(eventId, userId, message || null);

    revalidatePath("/assignments");
    revalidatePath("/requests");
    revalidatePath("/approvals");

    return NextResponse.json(
      { message: "Request submitted successfully.", id: requestId },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("[api/requests] Error creating request:", error);
    return NextResponse.json(
      { message: error?.message || "Failed to create request." },
      { status: 500 }
    );
  }
}

