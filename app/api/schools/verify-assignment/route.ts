import { NextResponse } from "next/server";
import { getSessionServer } from "@/lib/auth";
import { getUserSchool } from "@/lib/repos/schools";
import type { SessionUser } from "@/lib/types/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSessionServer();
    if (!session?.user?.email) {
      return NextResponse.json({ hasSchool: false }, { status: 401 });
    }

    // Check legacy system first
    const membership = await getUserSchool(session.user.email);
    if (membership?.schoolId) {
      return NextResponse.json({ hasSchool: true });
    }

    // Also check the new context system
    const user = session.user as SessionUser;
    const userId = user.id;
    if (userId) {
      try {
        const { getActiveUserContext } = await import("@/lib/repos/user-contexts");
        const context = await getActiveUserContext(userId);
        if (context?.schoolId) {
          return NextResponse.json({ hasSchool: true });
        }
      } catch (err) {
        console.warn("[api/schools/verify-assignment] Context check failed", err);
      }
    }

    return NextResponse.json({ hasSchool: false });
  } catch (error) {
    console.error("[api/schools/verify-assignment] failed", error);
    return NextResponse.json({ hasSchool: false }, { status: 500 });
  }
}

