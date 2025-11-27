import { NextResponse } from "next/server";
import { getSessionServer } from "@/lib/auth";
import { getUserContexts } from "@/lib/repos/user-contexts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSessionServer();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as any;
    const userId = user?.id;
    if (!userId) {
      return NextResponse.json(
        { message: "User ID not found in session." },
        { status: 400 }
      );
    }

    const contexts = await getUserContexts(userId);
    return NextResponse.json({ contexts });
  } catch (error: any) {
    console.error("[api/user/contexts] GET failed", error);
    return NextResponse.json(
      { message: error?.message || "Failed to fetch contexts." },
      { status: 500 }
    );
  }
}

