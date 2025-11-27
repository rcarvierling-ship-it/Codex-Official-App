import { redirect } from "next/navigation";
import { getAuthRole, requireAuth } from "@/lib/auth-helpers";
import { getAssignments } from "@/lib/repos/assignments";
import { getEvents } from "@/lib/repos/events";
import { getUsers } from "@/lib/repos/users";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { SessionUser } from "@/lib/types/auth";

export const metadata = { title: "Official Dashboard" };
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function OfficialDashboardPage() {
  const session = await requireAuth();
  const role = await getAuthRole();
  
  // Only official can access official dashboard
  if (role !== "official") {
    redirect("/dashboard");
  }

  const user = session.user as SessionUser;
  const currentUserId = user.id;
  const canSeeAll = user.canSeeAll ?? false;
  const accessibleSchools = user.accessibleSchools ?? [];
  const accessibleLeagues = user.accessibleLeagues ?? [];

  const [assignments, events, users] = await Promise.all([
    getAssignments(),
    getEvents(canSeeAll ? null : { schoolIds: accessibleSchools, leagueIds: accessibleLeagues }),
    getUsers(),
  ]);

  const eventMap = new Map(events.map((e) => [e.id, e]));
  const userMap = new Map(users.map((u) => [u.id, u]));

  // Get my assignments
  const myAssignments = assignments
    .filter((a) => a.userId === currentUserId && a.status === "ASSIGNED")
    .map((a) => ({
      ...a,
      event: eventMap.get(a.eventId),
    }))
    .sort((a, b) => {
      const aDate = a.event ? new Date(a.event.startsAt).getTime() : 0;
      const bDate = b.event ? new Date(b.event.startsAt).getTime() : 0;
      return aDate - bDate;
    });

  // Get upcoming assignments
  const now = new Date();
  const upcomingAssignments = myAssignments.filter((a) => {
    if (!a.event) return false;
    const eventDate = new Date(a.event.startsAt);
    return eventDate >= now;
  });

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Official Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          View your assignments and manage your availability.
        </p>
      </header>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-card/80">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm text-muted-foreground">Upcoming Assignments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{upcomingAssignments.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Scheduled games</p>
          </CardContent>
        </Card>

        <Card className="bg-card/80">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm text-muted-foreground">Total Assignments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{myAssignments.length}</div>
            <p className="text-xs text-muted-foreground mt-1">All time</p>
          </CardContent>
        </Card>

        <Card className="bg-card/80">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm text-muted-foreground">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="outline" className="text-sm">Active</Badge>
            <p className="text-xs text-muted-foreground mt-1">Ready to officiate</p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Assignments */}
      <Card className="bg-card/80">
        <CardHeader>
          <CardTitle className="text-lg">Upcoming Assignments</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {upcomingAssignments.length === 0 ? (
            <p className="text-sm text-muted-foreground">No upcoming assignments.</p>
          ) : (
            upcomingAssignments.slice(0, 10).map((assignment) => (
              <div key={assignment.id} className="flex items-center justify-between">
                <div>
                  <Link
                    href={`/events/${assignment.eventId}`}
                    className="font-medium hover:underline"
                  >
                    {assignment.event?.name || "Unknown Event"}
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    {assignment.event
                      ? format(new Date(assignment.event.startsAt), "MMM d, yyyy 'at' h:mm a")
                      : "Date TBD"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Role: {assignment.role || "Official"}
                  </p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {assignment.status}
                </Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-card/80">
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild variant="outline" className="w-full">
              <Link href="/assignments">View All Assignments</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/officials">Manage Availability</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/payments">View Payments</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

