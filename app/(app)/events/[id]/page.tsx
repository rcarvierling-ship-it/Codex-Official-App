import { getEvents } from "@/lib/repos/events";
import { getRequests } from "@/lib/repos/requests";
import { getAssignments } from "@/lib/repos/assignments";
import { getUsers } from "@/lib/repos/users";
import { requireAuth } from "@/lib/auth-helpers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { notFound } from "next/navigation";

export const metadata = { title: "Event Details" };
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function EventDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await requireAuth();
  const user = session.user as any;
  const canSeeAll = user?.canSeeAll ?? false;
  const accessibleSchools = user?.accessibleSchools ?? [];
  const accessibleLeagues = user?.accessibleLeagues ?? [];
  const { id } = params;

  const filterBy = canSeeAll
    ? null
    : { schoolIds: accessibleSchools, leagueIds: accessibleLeagues };

  const [events, requests, assignments, users] = await Promise.all([
    getEvents(filterBy),
    getRequests(),
    getAssignments(),
    getUsers(),
  ]);

  const event = events.find((e) => e.id === id);
  if (!event) {
    notFound();
  }

  const eventRequests = requests.filter((r) => r.eventId === id);
  const eventAssignments = assignments.filter((a) => a.eventId === id);
  const userMap = new Map(users.map((u) => [u.id, u]));

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">{event.name}</h1>
        <p className="text-sm text-muted-foreground">
          {format(new Date(event.startsAt), "MMM d, yyyy 'at' h:mm a")}
          {event.endsAt && ` - ${format(new Date(event.endsAt), "h:mm a")}`}
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-card/80">
          <CardHeader>
            <CardTitle className="text-lg">Requests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {eventRequests.length === 0 ? (
              <p className="text-sm text-muted-foreground">No requests for this event.</p>
            ) : (
              eventRequests.map((request) => {
                const user = userMap.get(request.userId);
                return (
                  <div key={request.id} className="rounded-lg border bg-background/60 p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">{user?.name ?? "Unknown"}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(request.submittedAt), "MMM d, h:mm a")}
                        </p>
                      </div>
                      <Badge
                        variant={
                          request.status === "APPROVED"
                            ? "default"
                            : request.status === "DECLINED"
                            ? "destructive"
                            : "outline"
                        }
                        className="text-xs"
                      >
                        {request.status}
                      </Badge>
                    </div>
                    {request.message && (
                      <p className="text-xs text-muted-foreground mt-2">{request.message}</p>
                    )}
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        <Card className="bg-card/80">
          <CardHeader>
            <CardTitle className="text-lg">Assignments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {eventAssignments.length === 0 ? (
              <p className="text-sm text-muted-foreground">No assignments for this event.</p>
            ) : (
              eventAssignments.map((assignment) => {
                const user = userMap.get(assignment.userId);
                return (
                  <div key={assignment.id} className="rounded-lg border bg-background/60 p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">{user?.name ?? "Unknown"}</p>
                        <p className="text-xs text-muted-foreground">{assignment.role}</p>
                      </div>
                      <Badge
                        variant={
                          assignment.status === "COMPLETED"
                            ? "default"
                            : assignment.status === "CANCELLED"
                            ? "destructive"
                            : "outline"
                        }
                        className="text-xs"
                      >
                        {assignment.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Confirmed: {format(new Date(assignment.createdAt), "MMM d, h:mm a")}
                    </p>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
