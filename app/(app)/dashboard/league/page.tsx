import { redirect } from "next/navigation";
import { getAuthRole, requireAuth } from "@/lib/auth-helpers";
import { AdminDashboardClient } from "@/app/(app)/admin/AdminDashboardClient";
import { getEvents } from "@/lib/repos/events";
import { getUsers } from "@/lib/repos/users";
import { getRequests } from "@/lib/repos/requests";
import { getAssignments } from "@/lib/repos/assignments";
import { sql } from "@/lib/db";

export const metadata = { title: "League Dashboard" };
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

export default async function LeagueDashboardPage() {
  const session = await requireAuth();
  const role = await getAuthRole();
  
  // Only league_admin can access league dashboard
  if (role !== "league_admin") {
    redirect("/dashboard");
  }

  const user = session.user as any;
  const canSeeAll = user?.canSeeAll ?? false;
  const accessibleSchools = user?.accessibleSchools ?? [];
  const accessibleLeagues = user?.accessibleLeagues ?? [];

  const filterBy = canSeeAll
    ? null
    : { schoolIds: accessibleSchools, leagueIds: accessibleLeagues };

  const [events, users, requests, assignments, teams] = await Promise.all([
    getEvents(filterBy),
    getUsers(),
    getRequests(),
    getAssignments(),
    getTeams(accessibleSchools),
  ]);

  const now = new Date();
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

  const upcomingEvents = events
    .filter((e) => {
      const eventDate = new Date(e.startsAt);
      return eventDate >= now && eventDate <= thirtyDaysFromNow;
    })
    .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime())
    .slice(0, 10);

  const recentEvents = events
    .filter((e) => {
      const eventDate = new Date(e.startsAt);
      return eventDate < now;
    })
    .sort((a, b) => new Date(b.startsAt).getTime() - new Date(a.startsAt).getTime())
    .slice(0, 10);

  const eventMap = new Map(events.map((e) => [e.id, e]));
  const userMap = new Map(users.map((u) => [u.id, u]));

  const requestsForSchool = requests.filter((request) => eventMap.has(request.eventId));
  const assignmentsForSchool = assignments.filter((assignment) => eventMap.has(assignment.eventId));
  const usersForSchool = canSeeAll
    ? users
    : users.filter((user) =>
        Array.isArray(user.schoolIds) && user.schoolIds.length > 0
          ? user.schoolIds.some((id) => accessibleSchools.includes(id))
          : false
      );

  const pendingRequests = requestsForSchool.filter((r) => r.status === "PENDING");
  const myAssignments = assignmentsForSchool.filter((a) => a.status === "ASSIGNED");
  const officials = usersForSchool.filter((u) => u.role === "official").length;

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">League Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Manage your league, schools, events, and officials.
        </p>
      </header>
      <AdminDashboardClient
        data={{
          upcomingEvents,
          recentEvents,
          myTeams: teams,
          eventRequests: requestsForSchool.map((r) => ({
            ...r,
            event: eventMap.get(r.eventId),
            user: userMap.get(r.userId),
          })),
          eventAssignments: assignmentsForSchool.map((a) => ({
            ...a,
            event: eventMap.get(a.eventId),
            user: userMap.get(a.userId),
          })),
          users: usersForSchool,
          stats: {
            totalEvents: events.length,
            totalTeams: teams.length,
            totalUsers: usersForSchool.length,
            pendingRequests: pendingRequests.length,
            confirmedAssignments: myAssignments.length,
            activeOfficials: officials,
            recentEventsCount: recentEvents.length,
          },
        }}
      />
    </div>
  );
}

