import { NextResponse } from "next/server";
import { getSessionServer } from "@/lib/auth";
import { sql } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const session = await getSessionServer();
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { role } = await request.json().catch(() => ({}));
    if (!role || typeof role !== "string") {
      return NextResponse.json({ message: "Role is required." }, { status: 400 });
    }

    const validRoles = ["USER", "COACH", "OFFICIAL", "AD", "ADMIN", "SUPER_ADMIN"];
    if (!validRoles.includes(role)) {
      return NextResponse.json({ message: "Invalid role." }, { status: 400 });
    }

    const email = session.user.email;
    
    // Update user role in database
    try {
      await sql`
        update users 
        set role = ${role} 
        where email = ${email}
      `;
    } catch (error) {
      console.error("[api/user/update-role] failed to update role", error);
      return NextResponse.json(
        { message: "Unable to update role right now." },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true, role });
  } catch (error) {
    console.error("[api/user/update-role] failed", error);
    return NextResponse.json(
      { message: "Unable to update role right now." },
      { status: 500 },
    );
  }
}

