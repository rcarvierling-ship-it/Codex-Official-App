import { NextResponse } from "next/server";
import { getSessionServer } from "@/lib/auth";
import { switchUserContext } from "@/lib/repos/user-contexts";
import { revalidatePath } from "next/cache";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
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

    const body = await request.json();
    const { contextId } = body;

    if (!contextId || typeof contextId !== "string") {
      return NextResponse.json(
        { message: "contextId is required." },
        { status: 400 }
      );
    }

    await switchUserContext(userId, contextId);

    // Revalidate all app pages to refresh session
    revalidatePath("/", "layout");
    revalidatePath("/dashboard");
    revalidatePath("/admin");
    revalidatePath("/approvals");
    revalidatePath("/assignments");
    revalidatePath("/events");
    revalidatePath("/payments");

    return NextResponse.json({ message: "Context switched successfully." });
  } catch (error: any) {
    console.error("[api/user/switch-context] POST failed", error);
    return NextResponse.json(
      { message: error?.message || "Failed to switch context." },
      { status: 500 }
    );
  }
}

