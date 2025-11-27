import { redirect } from "next/navigation";
import { getAuthRole, requireAuth } from "@/lib/auth-helpers";
import { getEvents } from "@/lib/repos/events";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import Link from "next/link";

export const metadata = { title: "Fan Dashboard" };
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function FanDashboardPage() {
  const session = await requireAuth();
  const role = await getAuthRole();
  
  // Only fan can access fan dashboard
  if (role !== "fan") {
    redirect("/dashboard");
  }

  const user = session.user as any;
  const canSeeAll = user?.canSeeAll ?? false;
  const accessibleSchools = user?.accessibleSchools ?? [];
  const accessibleLeagues = user?.accessibleLeagues ?? [];

  const filterBy = canSeeAll
    ? null
    : { schoolIds: accessibleSchools, leagueIds: accessibleLeagues };

  const events = await getEvents(filterBy);

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

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Fan Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          View upcoming games and events for your school.
        </p>
      </header>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
            <CardTitle className="text-sm text-muted-foreground">Total Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{events.length}</div>
            <p className="text-xs text-muted-foreground mt-1">All events</p>
          </CardContent>
        </Card>

        <Card className="bg-card/80">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm text-muted-foreground">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="outline" className="text-sm">Active</Badge>
            <p className="text-xs text-muted-foreground mt-1">Connected</p>
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

      {/* Quick Links */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-card/80">
          <CardHeader>
            <CardTitle className="text-lg">Quick Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/events" className="text-sm text-muted-foreground hover:text-foreground">
              View All Events →
            </Link>
            <Link href="/standings" className="text-sm text-muted-foreground hover:text-foreground">
              View Standings →
            </Link>
            <Link href="/browser" className="text-sm text-muted-foreground hover:text-foreground">
              Browse Schools →
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

