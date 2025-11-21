import { redirect } from "next/navigation";
import { getAuthRole, requireAuth } from "@/lib/auth-helpers";
import { getEvents } from "@/lib/repos/events";
import { getRequests } from "@/lib/repos/requests";
import { getAssignments } from "@/lib/repos/assignments";
import { getUsers } from "@/lib/repos/users";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Dashboard" };
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await requireAuth();
  const role = await getAuthRole();
  const activeSchoolId = (session.user as any)?.schoolId ?? null;

  // Redirect based on role to appropriate default page
  if (role === "SUPER_ADMIN" || role === "ADMIN") {
    redirect("/admin");
  }
  if (role === "AD") {
    redirect("/approvals");
  }
  if (role === "OFFICIAL") {
    redirect("/assignments");
  }

  // For COACH and USER, show a simple dashboard
  const user = session.user as any;
  const canSeeAll = user?.canSeeAll ?? false;
  const accessibleSchools = user?.accessibleSchools ?? [];
  const accessibleLeagues = user?.accessibleLeagues ?? [];

  const filterBy = canSeeAll
    ? null
    : { schoolIds: accessibleSchools, leagueIds: accessibleLeagues };

  const [events, requests, assignments, users] = await Promise.all([
    getEvents(filterBy),
    getRequests(),
    getAssignments(),
    getUsers(),
  ]);

  const eventIdSet = new Set(events.map((event) => event.id));
  const requestsForSchool = requests.filter((request) => eventIdSet.has(request.eventId));
  const assignmentsForSchool = assignments.filter((assignment) => eventIdSet.has(assignment.eventId));
  const usersForSchool = canSeeAll
    ? users
    : users.filter((user) =>
        Array.isArray(user.schoolIds) && user.schoolIds.length > 0
          ? user.schoolIds.some((id) => accessibleSchools.includes(id))
          : false
      );

  const pendingRequests = requestsForSchool.filter((r) => r.status === "PENDING");
  const myAssignments = assignmentsForSchool.filter((a) => a.status === "ASSIGNED");

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Welcome back. Here's what's happening with your events and assignments.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card/80">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm text-muted-foreground">Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-foreground">{events.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Total events</p>
          </CardContent>
        </Card>

        <Card className="bg-card/80">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm text-muted-foreground">Pending Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-foreground">{pendingRequests.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Total events</p>
          </CardContent>
        </Card>

        <Card className="bg-card/80">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm text-muted-foreground">My Assignments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-foreground">{myAssignments.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Active assignments</p>
          </CardContent>
        </Card>

        <Card className="bg-card/80">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm text-muted-foreground">Officials</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-foreground">
              {usersForSchool.filter((u) => u.role === "OFFICIAL").length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Registered officials</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-card/80">
          <CardHeader>
            <CardTitle className="text-lg">Recent Events</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {events.slice(0, 5).map((event) => (
              <div key={event.id} className="flex items-center justify-between rounded-lg border bg-background/60 p-3">
                <div>
                  <p className="font-medium text-foreground">{event.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(event.startsAt), "MMM d, yyyy 'at' h:mm a")}
                  </p>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/events/${event.id}`}>View</Link>
                </Button>
              </div>
            ))}
            {events.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No events yet</p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card/80">
          <CardHeader>
            <CardTitle className="text-lg">Pending Requests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingRequests.slice(0, 5).map((request) => (
              <div key={request.id} className="flex items-center justify-between rounded-lg border bg-background/60 p-3">
                <div>
                  <p className="font-medium text-foreground">Request #{request.id.slice(0, 8)}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(request.submittedAt), "MMM d, h:mm a")}
                  </p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {request.status}
                </Badge>
              </div>
            ))}
            {pendingRequests.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No pending requests</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
