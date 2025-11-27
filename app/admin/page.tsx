import { format } from "date-fns";
import { sql } from "drizzle-orm";

import { Sidebar } from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { requireRole } from "@/lib/auth-helpers";
import { getRequests } from "@lib/repos/requests";
import { getAssignments } from "@/lib/repos/assignments";
import { hasDbEnv } from "@/lib/db";
import { getEvents } from "@/lib/repos/events";
import { getUsers } from "@/lib/repos/users";
import { AdminDashboardClient } from "../(app)/admin/AdminDashboardClient";
import { subDays, startOfDay } from "date-fns";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function getWaitlistEntries() {
  try {
    if (!hasDbEnv) return [] as any[];
    const { db } = await import("@/server/db/client");
    const { waitlist } = await import("@/server/db/schema");
    const rows = await db
      .select({
        id: waitlist.id,
        name: waitlist.name,
        email: waitlist.email,
        org: waitlist.org,
        role: waitlist.role,
        createdAt: waitlist.createdAt,
      })
      .from(waitlist)
      .orderBy(sql`"created_at" desc`)
      .limit(50);

    return rows;
  } catch (error) {
    console.warn("[admin] waitlist fetch failed", error);
    return [];
  }
}

async function getTeams(schoolIds: string[]) {
  try {
    if (schoolIds.length === 0) return [];
    const { sql: sqlQuery } = await import("@/lib/db");
    const { rows } = await sqlQuery<{ id: string; name: string; sport: string | null; level: string | null; school_id: string | null }>`
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

import type { SessionUser } from "@/lib/types/auth";

export default async function AdminPage() {
  const { role, session } = await requireRole("league_admin");
  const user = session.user as SessionUser;
  const activeSchoolId = user.schoolId ?? null;
  const activeSchoolName = user.school?.name ?? "";
  const canSeeAll = user.canSeeAll ?? false;
  const accessibleSchools = user.accessibleSchools ?? [];
  const accessibleLeagues = user.accessibleLeagues ?? [];

  const filterBy = canSeeAll
    ? null
    : { schoolIds: accessibleSchools, leagueIds: accessibleLeagues };

  const [events, users, waitlistRowsRaw, requests, assignments, teams] = await Promise.all([
    getEvents(filterBy),
    getUsers(),
    getWaitlistEntries(),
    getRequests(),
    getAssignments(),
    getTeams(accessibleSchools),
  ]);

  const eventsForSchool = activeSchoolId
    ? events.filter((event) => event.schoolId === activeSchoolId)
    : events;
  const usersForSchool = activeSchoolId
    ? users.filter((user) =>
        Array.isArray(user.schoolIds) ? user.schoolIds.includes(activeSchoolId) : true
      )
    : users;

  const waitlistRows = waitlistRowsRaw.filter((entry: any) => {
    if (!activeSchoolName) return true;
    if (!entry.org) return false;
    return String(entry.org).toLowerCase().includes(activeSchoolName.toLowerCase());
  });

  const eventMap = new Map(events.map((e) => [e.id, e]));
  const userMap = new Map(users.map((u) => [u.id, u]));
  const eventIdSet = new Set(eventsForSchool.map((event) => event.id));
  const requestsForSchool = requests.filter((request) => eventIdSet.has(request.eventId));

  // Get upcoming events (next 30 days)
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

  // Get recent events (last 30 days)
  const last30Days = startOfDay(subDays(now, 30));
  const recentEvents = events
    .filter((e) => {
      const eventDate = new Date(e.startsAt);
      return eventDate >= last30Days && eventDate < now;
    })
    .sort((a, b) => new Date(b.startsAt).getTime() - new Date(a.startsAt).getTime())
    .slice(0, 10);

  // Get requests and assignments
  const eventRequests = requests
    .filter((r) => eventIdSet.has(r.eventId))
    .map((r) => ({
      ...r,
      event: eventMap.get(r.eventId),
      user: userMap.get(r.userId),
    }));

  const eventAssignments = assignments
    .filter((a) => eventIdSet.has(a.eventId))
    .map((a) => ({
      ...a,
      event: eventMap.get(a.eventId),
      user: userMap.get(a.userId),
    }))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Get officials
  const officials = users.filter((u) => u.role === "official");

  // Get recent users (just take first 10, sorting by createdAt if available)
  const recentUsers = users.slice(0, 10);

  const eventsCount = eventsForSchool.length;
  const usersCount = usersForSchool.length;
  const waitlistCount = waitlistRows.length;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-4 py-12 lg:flex-row">
      <Sidebar role={role} title="Operations" />
      <div className="flex-1 space-y-10">
        {/* Use the new AdminDashboardClient for the main dashboard */}
        <AdminDashboardClient
          data={{
            upcomingEvents,
            recentEvents,
            myTeams: teams,
            eventRequests,
            eventAssignments,
            users: recentUsers,
            stats: {
              totalEvents: events.length,
              totalTeams: teams.length,
              totalUsers: users.length,
              pendingRequests: eventRequests.filter((r) => r.status === "PENDING").length,
              confirmedAssignments: eventAssignments.filter((a) => a.status === "ASSIGNED").length,
              activeOfficials: officials.length,
              recentEventsCount: recentEvents.length,
            },
            schoolName: activeSchoolName || null,
          }}
        />

        {/* Keep waitlist section below */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Latest waitlist entries</h2>
            <span className="text-xs text-muted-foreground">
              Showing {Math.min(waitlistRows.length, 50)} most recent submissions
            </span>
          </div>

          <div className="overflow-hidden rounded-2xl border border-border bg-card/80 shadow-lg">
            <div className="grid gap-0 border-b border-border bg-card/40 px-6 py-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">
              <div className="grid grid-cols-[1.2fr,1.2fr,1fr,0.8fr,0.8fr]">
                <span>Name</span>
                <span>Email</span>
                <span>Organization</span>
                <span>Role</span>
                <span>Joined</span>
              </div>
            </div>
            {waitlistRows.length === 0 ? (
              <div className="px-6 py-10 text-sm text-muted-foreground">
                No waitlist entries yet. Submit the form on the landing page to test the flow.
              </div>
            ) : (
              <ul className="divide-y divide-border/70">
                {(waitlistRows as any[]).map((entry: any) => (
                  <li key={entry.id} className="grid grid-cols-[1.2fr,1.2fr,1fr,0.8fr,0.8fr] items-center gap-4 px-6 py-4 text-sm">
                    <span className="font-medium">{entry.name}</span>
                    <span className="truncate text-muted-foreground">{entry.email}</span>
                    <span className="truncate text-muted-foreground">{entry.org ?? "—"}</span>
                    <span className="rounded-full border border-[hsl(var(--accent)/0.3)] bg-[hsl(var(--accent)/0.1)] px-3 py-1 text-xs uppercase tracking-widest text-[hsl(var(--accent))]">
                      {entry.role ?? "n/a"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {entry.createdAt ? format(new Date(entry.createdAt), "MMM d, yyyy") : "—"}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Latest requests</h2>
            <span className="text-xs text-muted-foreground">
              Pulling {requestsForSchool.length} most recent requests
            </span>
          </div>
          <div className="overflow-hidden rounded-2xl border border-border bg-card/80 shadow-lg">
            {requestsForSchool.length === 0 ? (
              <div className="px-6 py-8 text-sm text-muted-foreground">
                No requests found. Seed your database or capture requests via the API to see them here.
              </div>
            ) : (
              <ul className="divide-y divide-border/60">
                {requestsForSchool.slice(0, 10).map((request) => (
                  <li
                    key={request.id}
                    className="flex flex-col gap-1 px-6 py-4 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between"
                  >
                    <div>
                      <p className="font-medium text-foreground">Event {request.eventId}</p>
                      <p className="text-xs">User {request.userId}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={cn(
                        "rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide",
                        request.status === "APPROVED" && "border-emerald-500/40 text-emerald-300",
                        request.status === "DECLINED" && "border-red-500/40 text-red-300",
                        request.status === "PENDING" && "border-[hsl(var(--accent)/0.4)] text-[hsl(var(--accent))]"
                      )}>
                        {request.status}
                      </span>
                      <span className="text-xs">
                        {format(new Date(request.submittedAt), "MMM d, yyyy · h:mm a")}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
