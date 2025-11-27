import { getRequests } from "@/lib/repos/requests";
import { getEvents } from "@/lib/repos/events";
import { getUsers } from "@/lib/repos/users";
import { getAssignments } from "@/lib/repos/assignments";
import { getGameChangeRequests } from "@/lib/repos/game-change-requests";
import { requireRole } from "@/lib/auth-helpers";
import { sql } from "@/lib/db";
import { ADDashboardClient } from "./ADDashboardClient";

export const metadata = { title: "Athletic Director Dashboard" };
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function getTeams(schoolIds: string[]) {
  try {
    if (schoolIds.length === 0) return [];
    const { rows } = await sql<{ id: string; name: string; sport: string | null; level: string | null; school_id: string | null }>`
      SELECT id, name, sport, level, school_id
      FROM teams
      WHERE school_id = ANY(${schoolIds})
      ORDER BY name ASC
    `;
    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      sport: r.sport,
      level: r.level,
      schoolId: r.school_id,
    }));
  } catch {
    return [];
  }
}

export default async function ApprovalsPage() {
  const { session } = await requireRole("athletic_director");
  const user = session.user as any;
  const canSeeAll = user?.canSeeAll ?? false;
  const accessibleSchools = user?.accessibleSchools ?? [];
  const accessibleLeagues = user?.accessibleLeagues ?? [];

  const filterBy = canSeeAll
    ? null
    : { schoolIds: accessibleSchools, leagueIds: accessibleLeagues };

  const [requests, events, users, assignments, teams, changeRequests] = await Promise.all([
    getRequests(),
    getEvents(filterBy),
    getUsers(),
    getAssignments(),
    getTeams(accessibleSchools),
    getGameChangeRequests({ status: "PENDING", schoolIds: canSeeAll ? undefined : accessibleSchools }),
  ]);

  const eventMap = new Map(events.map((e) => [e.id, e]));
  const userMap = new Map(users.map((u) => [u.id, u]));

  // Filter pending requests for events the AD can see
  const pendingRequests = requests
    .filter((r) => r.status === "PENDING")
    .filter((r) => eventMap.has(r.eventId))
    .map((r) => ({
      ...r,
      user: userMap.get(r.userId),
      event: eventMap.get(r.eventId),
    }));

  // Get upcoming events (next 30 days)
  const now = new Date();
  const upcomingEvents = events
    .filter((e) => new Date(e.startsAt) >= now)
    .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime())
    .slice(0, 10);

  // Get recent assignments
  const recentAssignments = assignments
    .filter((a) => eventMap.has(a.eventId))
    .map((a) => ({
      ...a,
      user: userMap.get(a.userId),
      event: eventMap.get(a.eventId),
    }))
    .sort((a, b) => {
      // Sort by event start time if available
      const aTime = a.event?.startsAt ? new Date(a.event.startsAt).getTime() : 0;
      const bTime = b.event?.startsAt ? new Date(b.event.startsAt).getTime() : 0;
      return bTime - aTime;
    })
    .slice(0, 10);

  // Get officials (users with OFFICIAL role)
  const officials = users.filter((u) => u.role === "official");

  return (
    <ADDashboardClient
      data={{
        pendingRequests,
        upcomingEvents,
        recentAssignments,
        teams,
        officials,
        changeRequests: changeRequests.map((cr) => ({
          id: cr.id,
          eventId: cr.eventId,
          changeType: cr.changeType,
          currentValue: cr.currentValue,
          requestedValue: cr.requestedValue,
          reason: cr.reason,
          status: cr.status,
          createdAt: cr.createdAt,
          event: cr.event ? {
            id: cr.event.id,
            name: cr.event.name,
            startsAt: cr.event.startsAt,
          } : null,
          requester: cr.requester ? {
            id: cr.requester.id,
            name: cr.requester.name,
            email: cr.requester.email,
          } : null,
        })),
        stats: {
          totalPendingRequests: pendingRequests.length,
          totalUpcomingEvents: upcomingEvents.length,
          totalTeams: teams.length,
          totalOfficials: officials.length,
          totalAssignments: recentAssignments.length,
          pendingChangeRequests: changeRequests.length,
        },
      }}
    />
  );
}
