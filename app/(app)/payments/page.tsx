import { requireAuth, getAuthRole } from "@/lib/auth-helpers";
import { getPayments } from "@/lib/repos/payments";
import { getUsers } from "@/lib/repos/users";
import { getEvents } from "@/lib/repos/events";
import { getPayoutSettings } from "@/lib/repos/payments";
import { PaymentsDashboardClient } from "./PaymentsDashboardClient";
import type { SessionUser } from "@/lib/types/auth";

export const metadata = { title: "Payments" };
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function PaymentsPage() {
  const session = await requireAuth();
  const role = await getAuthRole();
  const user = session.user as SessionUser;
  const currentUserId = user.id;
  const canSeeAll = user.canSeeAll ?? false;
  const accessibleSchools = user.accessibleSchools ?? [];
  const accessibleLeagues = user.accessibleLeagues ?? [];

  const filterBy = canSeeAll
    ? null
    : { schoolIds: accessibleSchools, leagueIds: accessibleLeagues };

  // Officials see only their payments, ADs/Admins see all payments for their schools
  const effectiveUserId = role === "official" ? currentUserId : undefined;
  const schoolIds = canSeeAll ? undefined : accessibleSchools;

  const [payments, users, events, payoutSettings] = await Promise.all([
    getPayments(effectiveUserId, undefined, schoolIds),
    getUsers(),
    getEvents(filterBy),
    role === "league_admin" || role === "school_admin" ? getPayoutSettings(null, null) : Promise.resolve(null),
  ]);

  const userMap = new Map(users.map((u) => [u.id, { name: u.name, email: u.email }]));
  const eventMap = new Map(events.map((e) => [e.id, { name: e.name, startsAt: e.startsAt }]));

  // Calculate totals
  const totalPending = payments
    .filter((p) => p.status === "PENDING")
    .reduce((sum, p) => sum + p.amount, 0);
  const totalApproved = payments
    .filter((p) => p.status === "APPROVED")
    .reduce((sum, p) => sum + p.amount, 0);
  const totalPaid = payments
    .filter((p) => p.status === "PAID")
    .reduce((sum, p) => sum + p.amount, 0);
  const totalOwed = payments
    .filter((p) => p.status === "PENDING" || p.status === "APPROVED")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <PaymentsDashboardClient
      role={role}
      currentUserId={currentUserId || ""}
      payments={payments.map((p) => ({
        ...p,
        user: userMap.get(p.userId),
        event: eventMap.get(p.eventId),
        approver: p.approvedBy ? userMap.get(p.approvedBy) : undefined,
      }))}
      stats={{
        totalPending,
        totalApproved,
        totalPaid,
        totalOwed,
        pendingCount: payments.filter((p) => p.status === "PENDING").length,
        approvedCount: payments.filter((p) => p.status === "APPROVED").length,
        paidCount: payments.filter((p) => p.status === "PAID").length,
      }}
      payoutSettings={payoutSettings}
    />
  );
}

