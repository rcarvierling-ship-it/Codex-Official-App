import { getRequests } from "@/lib/repos/requests";
import { getEvents } from "@/lib/repos/events";
import { getUsers } from "@/lib/repos/users";
import { requireAuth } from "@/lib/auth-helpers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata = { title: "Requests" };
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function RequestsPage() {
  const session = await requireAuth();
  const activeSchoolId = (session.user as any)?.schoolId ?? null;

  const [requests, events, users] = await Promise.all([
    getRequests(),
    getEvents(),
    getUsers(),
  ]);

  const eventsForSchool = activeSchoolId
    ? events.filter((event) => event.schoolId === activeSchoolId)
    : events;
  const eventMap = new Map(eventsForSchool.map((e) => [e.id, e]));
  const userMap = new Map(users.map((u) => [u.id, u]));
  const scopedRequests = requests.filter((request) => eventMap.has(request.eventId));

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Requests</h1>
        <p className="text-sm text-muted-foreground">
          Review all work requests from officials.
        </p>
      </header>

      {scopedRequests.length === 0 ? (
        <Card className="bg-card/80">
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            No requests found.
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card/80">
          <table className="min-w-full divide-y divide-border/80 text-sm">
            <thead className="bg-background/60 text-xs uppercase tracking-[0.3em] text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left">Official</th>
                <th className="px-4 py-3 text-left">Event</th>
                <th className="px-4 py-3 text-left">Submitted</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {scopedRequests.map((request) => {
                const user = userMap.get(request.userId);
                const event = eventMap.get(request.eventId);
                return (
                  <tr key={request.id} className="text-muted-foreground">
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground">{user?.name ?? "Unknown"}</p>
                      <p className="text-xs">{user?.email ?? request.userId}</p>
                    </td>
                    <td className="px-4 py-3">
                      {event ? (
                        <Link
                          href={`/events/${event.id}`}
                          className="text-sm text-[hsl(var(--accent))] hover:underline"
                        >
                          {event.name}
                        </Link>
                      ) : (
                        <span className="text-sm">Event {request.eventId.slice(0, 8)}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs">
                      {format(new Date(request.submittedAt), "MMM d, h:mm a")}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        className={cn(
                          "px-3 py-1 text-xs",
                          request.status === "PENDING" &&
                            "bg-[hsl(var(--accent)/0.2)] text-[hsl(var(--accent))]",
                          request.status === "APPROVED" && "bg-emerald-500/20 text-emerald-300",
                          request.status === "DECLINED" && "bg-red-500/20 text-red-300",
                        )}
                      >
                        {request.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      {request.message && (
                        <p className="text-xs text-muted-foreground max-w-xs truncate">
                          {request.message}
                        </p>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
