import { NextResponse } from "next/server";
import { getSessionServer } from "@/lib/auth";
import { getPayments, approvePayment, markPaymentAsPaid } from "@/lib/repos/payments";
import { revalidatePath } from "next/cache";
import type { SessionUser } from "@/lib/types/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const session = await getSessionServer();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const status = searchParams.get("status") as any;
    const schoolIdsParam = searchParams.get("schoolIds");

    const user = session.user as SessionUser;
    const canSeeAll = user.canSeeAll ?? false;
    const accessibleSchools = user.accessibleSchools ?? [];

    // Officials can only see their own payments
    const effectiveUserId = user.role === "official" ? (user.id || userId || undefined) : (userId || undefined);
    
    // ADs and Admins can see payments for their schools
    const schoolIds = schoolIdsParam 
      ? schoolIdsParam.split(",").filter(Boolean)
      : (canSeeAll ? undefined : accessibleSchools);

    const payments = await getPayments(effectiveUserId, status, schoolIds);
    return NextResponse.json({ payments });
  } catch (error: any) {
    console.error("[api/payments] GET failed", error);
    return NextResponse.json(
      { message: error?.message || "Failed to fetch payments." },
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

    const user = session.user as SessionUser;
    const userId = user.id;
    if (!userId) {
      return NextResponse.json(
        { message: "User ID not found in session." },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { action, paymentId, notes } = body;

    if (!action || !paymentId) {
      return NextResponse.json(
        { message: "action and paymentId are required." },
        { status: 400 }
      );
    }

    // Only ADs and Admins can approve payments
    if (action === "approve") {
      if (user?.role !== "athletic_director" && user?.role !== "league_admin") {
        return NextResponse.json(
          { message: "Only Athletic Directors and Admins can approve payments." },
          { status: 403 }
        );
      }

      await approvePayment(paymentId, userId, notes);
      revalidatePath("/payments");
      return NextResponse.json({ message: "Payment approved successfully." });
    }

    // Only ADs and Admins can mark as paid
    if (action === "markPaid") {
      if (user?.role !== "athletic_director" && user?.role !== "league_admin") {
        return NextResponse.json(
          { message: "Only Athletic Directors and Admins can mark payments as paid." },
          { status: 403 }
        );
      }

      await markPaymentAsPaid(paymentId, notes);
      revalidatePath("/payments");
      return NextResponse.json({ message: "Payment marked as paid successfully." });
    }

    return NextResponse.json(
      { message: "Invalid action." },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("[api/payments] POST failed", error);
    return NextResponse.json(
      { message: error?.message || "Failed to process payment action." },
      { status: 500 }
    );
  }
}

