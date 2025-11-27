import { NextResponse } from "next/server";
import { getSessionServer } from "@/lib/auth";
import { getAuthRole } from "@/lib/auth-helpers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSessionServer();
    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const role = await getAuthRole();

    return NextResponse.json({ role });
  } catch (error: any) {
    console.error("[api/user/role] GET error:", error);
    return NextResponse.json(
      { message: error?.message || "Failed to get user role." },
      { status: 500 }
    );
  }
}

