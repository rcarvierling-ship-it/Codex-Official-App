import { redirect } from "next/navigation";
import { getAuthRole, requireAuth } from "@/lib/auth-helpers";
import { getEvents } from "@/lib/repos/events";
import { getRequests } from "@/lib/repos/requests";
import { getAssignments } from "@/lib/repos/assignments";
import { getUsers } from "@/lib/repos/users";
import { getGameChangeRequests } from "@/lib/repos/game-change-requests";
import { getSchoolById } from "@/lib/repos/schools";
import { sql } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { SessionUser } from "@/lib/types/auth";

export const metadata = { title: "School Dashboard" };
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

export default async function SchoolDashboardPage() {
  const session = await requireAuth();
  const role = await getAuthRole();
  
  // Only athletic_director and school_admin can access school dashboard
  if (role !== "athletic_director" && role !== "school_admin") {
    redirect("/dashboard");
  }

  const user = session.user as SessionUser;
  const currentUserId = user.id;
  const activeSchoolId = user.schoolId ?? null;
  const canSeeAll = user.canSeeAll ?? false;
  const accessibleSchools = user.accessibleSchools ?? [];
  const accessibleLeagues = user.accessibleLeagues ?? [];

  const filterBy = canSeeAll
    ? null
    : { schoolIds: accessibleSchools, leagueIds: accessibleLeagues };

  const [events, requests, assignments, users, teams, changeRequests] = await Promise.all([
    getEvents(filterBy),
    getRequests(),
    getAssignments(),
    getUsers(),
    getTeams(accessibleSchools),
    activeSchoolId ? getGameChangeRequests({ schoolIds: [activeSchoolId] }) : getGameChangeRequests(),
  ]);

  const eventMap = new Map(events.map((e) => [e.id, e]));
  const userMap = new Map(users.map((u) => [u.id, u]));

  const pendingRequests = requests.filter((r) => r.status === "PENDING" && eventMap.has(r.eventId));
  const pendingChangeRequests = changeRequests.filter((cr) => cr.status === "PENDING");
  const myAssignments = assignments.filter((a) => a.status === "ASSIGNED" && eventMap.has(a.eventId));

  // Get upcoming events
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

  let schoolBranding = null;
  if (activeSchoolId) {
    try {
      const school = await getSchoolById(activeSchoolId);
      if (school) {
        schoolBranding = {
          name: school.name,
          logoUrl: school.logoUrl,
        };
      }
    } catch (error) {
      console.error("Failed to fetch school branding:", error);
    }
  }

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          {schoolBranding?.name || "School"} Dashboard
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your school's events, teams, and officials.
        </p>
      </header>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card/80">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm text-muted-foreground">Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{upcomingEvents.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Next 30 days</p>
          </CardContent>
        </Card>

        <Card className="bg-card/80">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm text-muted-foreground">Pending Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{pendingRequests.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card className="bg-card/80">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm text-muted-foreground">Change Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{pendingChangeRequests.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Pending changes</p>
          </CardContent>
        </Card>

        <Card className="bg-card/80">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm text-muted-foreground">Teams</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{teams.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Active teams</p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Events */}
      <Card className="bg-card/80">
        <CardHeader>
          <CardTitle className="text-lg">Upcoming Events</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {upcomingEvents.length === 0 ? (
            <p className="text-sm text-muted-foreground">No upcoming events.</p>
          ) : (
            upcomingEvents.map((event) => (
              <div key={event.id} className="flex items-center justify-between">
                <div>
                  <Link href={`/events/${event.id}`} className="font-medium hover:underline">
                    {event.name}
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(event.startsAt), "MMM d, yyyy 'at' h:mm a")}
                  </p>
                </div>
                <Badge variant="outline" className="text-xs">
                  Scheduled
                </Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Pending Change Requests */}
      {pendingChangeRequests.length > 0 && (
        <Card className="bg-card/80">
          <CardHeader>
            <CardTitle className="text-lg">Pending Change Requests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingChangeRequests.slice(0, 5).map((request) => (
              <div key={request.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{request.changeType}</p>
                  <p className="text-xs text-muted-foreground">
                    {request.event?.name || "Unknown Event"}
                  </p>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/approvals`}>Review</Link>
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

