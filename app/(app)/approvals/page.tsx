import { getRequests } from "@/lib/repos/requests";
import { getEvents } from "@/lib/repos/events";
import { getUsers } from "@/lib/repos/users";
import { requireRole } from "@/lib/auth-helpers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ApproveRequestButton, DeclineRequestButton } from "./_components/RequestActions";

export const metadata = { title: "Approvals" };
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function ApprovalsPage() {
  const { session } = await requireRole("AD");
  const user = session.user as any;
  const canSeeAll = user?.canSeeAll ?? false;
  const accessibleSchools = user?.accessibleSchools ?? [];
  const accessibleLeagues = user?.accessibleLeagues ?? [];

  const filterBy = canSeeAll
    ? null
    : { schoolIds: accessibleSchools, leagueIds: accessibleLeagues };

  const [requests, events, users] = await Promise.all([
    getRequests(),
    getEvents(filterBy),
    getUsers(),
  ]);

  const eventMap = new Map(events.map((e) => [e.id, e]));
  const pendingRequests = requests
    .filter((r) => r.status === "PENDING")
    .filter((r) => eventMap.has(r.eventId));
  const userMap = new Map(users.map((u) => [u.id, u]));

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Approvals</h1>
        <p className="text-sm text-muted-foreground">
          Review and approve pending work requests from officials.
        </p>
      </header>

      {pendingRequests.length === 0 ? (
        <Card className="bg-card/80">
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            No approvals waiting. When officials request assignments, they'll appear here.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {pendingRequests.map((request) => {
            const user = userMap.get(request.userId);
            const event = eventMap.get(request.eventId);
            return (
              <Card key={request.id} className="bg-card/80">
                <CardHeader>
                  <CardTitle className="text-lg">{user?.name ?? "Unknown Official"}</CardTitle>
                  <p className="text-xs text-muted-foreground">
                    {event?.name ?? `Event ${request.eventId.slice(0, 8)}`} ·{" "}
                    {format(new Date(request.submittedAt), "MMM d, h:mm a")}
                  </p>
                </CardHeader>
                <CardContent className="space-y-3">
                  {request.message && (
                    <p className="text-sm text-muted-foreground">{request.message}</p>
                  )}
                  <div className="flex gap-3">
                    <ApproveRequestButton requestId={request.id} />
                    <DeclineRequestButton requestId={request.id} />
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
