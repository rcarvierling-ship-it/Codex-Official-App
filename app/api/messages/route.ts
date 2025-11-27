import { NextResponse } from "next/server";
import { getSessionServer } from "@/lib/auth";
import { getMessages, createMessage } from "@/lib/repos/messages";
import { revalidatePath } from "next/cache";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const session = await getSessionServer();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const entityType = searchParams.get("entityType") as "EVENT" | "TEAM" | "SCHOOL" | null;
    const entityId = searchParams.get("entityId");

    if (!entityType || !entityId) {
      return NextResponse.json(
        { message: "entityType and entityId are required." },
        { status: 400 }
      );
    }

    if (!["EVENT", "TEAM", "SCHOOL"].includes(entityType)) {
      return NextResponse.json(
        { message: "Invalid entityType. Must be EVENT, TEAM, or SCHOOL." },
        { status: 400 }
      );
    }

    const messages = await getMessages(entityType, entityId);
    return NextResponse.json({ messages });
  } catch (error: any) {
    console.error("[api/messages] GET failed", error);
    return NextResponse.json(
      { message: error?.message || "Failed to fetch messages." },
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

    // Get user ID from session or look it up by email
    let userId = (session.user as any)?.id;
    if (!userId) {
      const email = (session.user as any)?.email;
      if (!email) {
        return NextResponse.json(
          { message: "User ID not found in session." },
          { status: 400 }
        );
      }
      const { sql } = await import("@/lib/db");
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

    const body = await request.json();
    const { entityType, entityId, content } = body;

    if (!entityType || !entityId || !content) {
      return NextResponse.json(
        { message: "entityType, entityId, and content are required." },
        { status: 400 }
      );
    }

    if (!["EVENT", "TEAM", "SCHOOL"].includes(entityType)) {
      return NextResponse.json(
        { message: "Invalid entityType. Must be EVENT, TEAM, or SCHOOL." },
        { status: 400 }
      );
    }

    if (typeof content !== "string" || content.trim().length === 0) {
      return NextResponse.json(
        { message: "Content cannot be empty." },
        { status: 400 }
      );
    }

    const messageId = await createMessage(
      entityType,
      entityId,
      userId,
      content.trim()
    );

    // Revalidate relevant paths
    if (entityType === "EVENT") {
      revalidatePath(`/events/${entityId}`);
    } else if (entityType === "TEAM") {
      revalidatePath(`/teams/${entityId}`);
    } else if (entityType === "SCHOOL") {
      revalidatePath(`/admin/schools`);
    }

    return NextResponse.json(
      { message: "Message created successfully.", id: messageId },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("[api/messages] POST failed", error);
    return NextResponse.json(
      { message: error?.message || "Failed to create message." },
      { status: 500 }
    );
  }
}

