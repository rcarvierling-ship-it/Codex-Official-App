import { NextResponse } from "next/server";
import { getSessionServer } from "@/lib/auth";
import { getPayments } from "@/lib/repos/payments";
import { getUsers } from "@/lib/repos/users";
import { getEvents } from "@/lib/repos/events";
import { format } from "date-fns";
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
    const canSeeAll = user.canSeeAll ?? false;
    const accessibleSchools = user.accessibleSchools ?? [];

    // Only ADs and Admins can export
    if (user.role !== "athletic_director" && user.role !== "league_admin") {
      return NextResponse.json(
        { message: "Only Athletic Directors and Admins can export payments." },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as any;
    const schoolIds = canSeeAll ? undefined : accessibleSchools;

    const [payments, users, events] = await Promise.all([
      getPayments(undefined, status, schoolIds),
      getUsers(),
      getEvents(canSeeAll ? null : { schoolIds: accessibleSchools, leagueIds: user?.accessibleLeagues ?? [] }),
    ]);

    const userMap = new Map(users.map((u) => [u.id, u]));
    const eventMap = new Map(events.map((e) => [e.id, e]));

    // Generate CSV
    const headers = [
      "Payment ID",
      "Official Name",
      "Official Email",
      "Event Name",
      "Event Date",
      "Amount",
      "Status",
      "Approved By",
      "Approved At",
      "Paid At",
      "Created At",
      "Notes",
    ];

    const rows = payments.map((payment) => {
      const official = userMap.get(payment.userId);
      const event = eventMap.get(payment.eventId);
      const approver = payment.approvedBy ? userMap.get(payment.approvedBy) : null;

      return [
        payment.id,
        official?.name || "Unknown",
        official?.email || "",
        event?.name || "Unknown Event",
        event?.startsAt ? format(new Date(event.startsAt), "yyyy-MM-dd") : "",
        `$${payment.amount.toFixed(2)}`,
        payment.status,
        approver?.name || "",
        payment.approvedAt ? format(new Date(payment.approvedAt), "yyyy-MM-dd HH:mm:ss") : "",
        payment.paidAt ? format(new Date(payment.paidAt), "yyyy-MM-dd HH:mm:ss") : "",
        format(new Date(payment.createdAt), "yyyy-MM-dd HH:mm:ss"),
        payment.notes || "",
      ];
    });

    const csv = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")),
    ].join("\n");

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="payments-${format(new Date(), "yyyy-MM-dd")}.csv"`,
      },
    });
  } catch (error: any) {
    console.error("[api/payments/export] GET failed", error);
    return NextResponse.json(
      { message: error?.message || "Failed to export payments." },
      { status: 500 }
    );
  }
}

