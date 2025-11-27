import { NextResponse } from "next/server";
import { getSessionServer } from "@/lib/auth";
import { getPayoutSettings, updatePayoutSettings } from "@/lib/repos/payments";
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

    const user = session.user as SessionUser;
    // Only Admins can view payout settings
    if (user.role !== "league_admin") {
      return NextResponse.json(
        { message: "Only Admins can view payout settings." },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const leagueId = searchParams.get("leagueId");
    const schoolId = searchParams.get("schoolId");

    const settings = await getPayoutSettings(
      leagueId || null,
      schoolId || null
    );

    return NextResponse.json({ settings });
  } catch (error: any) {
    console.error("[api/payout-settings] GET failed", error);
    return NextResponse.json(
      { message: error?.message || "Failed to fetch payout settings." },
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
    // Only Admins can update payout settings
    if (user.role !== "league_admin") {
      return NextResponse.json(
        { message: "Only Admins can update payout settings." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { leagueId, schoolId, defaultAmount, roleBasedAmounts, autoApprove } = body;

    if (defaultAmount === undefined || defaultAmount < 0) {
      return NextResponse.json(
        { message: "defaultAmount is required and must be >= 0." },
        { status: 400 }
      );
    }

    const settingsId = await updatePayoutSettings(
      leagueId || null,
      schoolId || null,
      Number(defaultAmount),
      roleBasedAmounts,
      autoApprove
    );

    revalidatePath("/payments");
    return NextResponse.json({ message: "Payout settings updated successfully.", id: settingsId });
  } catch (error: any) {
    console.error("[api/payout-settings] POST failed", error);
    return NextResponse.json(
      { message: error?.message || "Failed to update payout settings." },
      { status: 500 }
    );
  }
}

