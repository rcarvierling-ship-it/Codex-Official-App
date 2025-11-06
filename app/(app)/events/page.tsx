import { getEvents } from "@/lib/repos/events";
import { getUsers } from "@/lib/repos/users";
import { requireAuth } from "@/lib/auth-helpers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import Link from "next/link";

export const metadata = { title: "Events" };
export const dynamic = "force-dynamic";

export default async function EventsPage() {
  await requireAuth();
  const [events, users] = await Promise.all([getEvents(), getUsers()]);

  const userMap = new Map(users.map((u) => [u.id, u]));

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Events</h1>
        <p className="text-sm text-muted-foreground">
          View and manage all scheduled events.
        </p>
      </header>

      {events.length === 0 ? (
        <Card className="bg-card/80">
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            No events found. Create your first event to get started.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {events.map((event) => {
            const schoolUser = event.schoolId ? userMap.get(event.schoolId) : null;
            return (
              <Card key={event.id} className="bg-card/80">
                <CardContent className="flex flex-col gap-3 py-5 md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground">{event.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(event.startsAt), "MMM d, yyyy · h:mm a")}
                      {event.endsAt && ` - ${format(new Date(event.endsAt), "h:mm a")}`}
                    </p>
                    {schoolUser && (
                      <p className="text-xs text-muted-foreground mt-1">
                        School: {schoolUser.name}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-xs">
                      Scheduled
                    </Badge>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/events/${event.id}`}>View Details</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

