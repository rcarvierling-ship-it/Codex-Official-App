import { getAssignments } from "@/lib/repos/assignments";
import { getEvents } from "@/lib/repos/events";
import { getUsers } from "@/lib/repos/users";
import { requireAuth } from "@/lib/auth-helpers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const metadata = { title: "Assignments" };
export const dynamic = "force-dynamic";

export default async function AssignmentsPage() {
  await requireAuth();
  const [assignments, events, users] = await Promise.all([
    getAssignments(),
    getEvents(),
    getUsers(),
  ]);

  const eventMap = new Map(events.map((e) => [e.id, e]));
  const userMap = new Map(users.map((u) => [u.id, u]));

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Assignments</h1>
        <p className="text-sm text-muted-foreground">
          View confirmed assignments for upcoming events.
        </p>
      </header>

      {assignments.length === 0 ? (
        <Card className="bg-card/80">
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            No assignments found.
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card/80">
          <table className="min-w-full divide-y divide-border/60 text-sm">
            <thead className="bg-background/60 text-xs uppercase tracking-[0.3em] text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left">Official</th>
                <th className="px-4 py-3 text-left">Event</th>
                <th className="px-4 py-3 text-left">Role</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Confirmed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {assignments.map((assignment) => {
                const user = userMap.get(assignment.userId);
                const event = eventMap.get(assignment.eventId);
                return (
                  <tr key={assignment.id} className="text-muted-foreground">
                    <td className="px-4 py-3 text-foreground">{user?.name ?? "Unknown"}</td>
                    <td className="px-4 py-3">
                      {event ? (
                        <Link
                          href={`/events/${event.id}`}
                          className="text-[hsl(var(--accent))] hover:underline"
                        >
                          {event.name}
                        </Link>
                      ) : (
                        <span>Event {assignment.eventId.slice(0, 8)}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">{assignment.role}</td>
                    <td className="px-4 py-3">
                      <Badge
                        className={cn(
                          "px-3 py-1 text-xs",
                          assignment.status === "ASSIGNED" &&
                            "bg-[hsl(var(--accent)/0.2)] text-[hsl(var(--accent))]",
                          assignment.status === "COMPLETED" && "bg-emerald-500/20 text-emerald-300",
                          assignment.status === "CANCELLED" && "bg-red-500/20 text-red-300",
                        )}
                      >
                        {assignment.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-xs">
                      {format(new Date(assignment.createdAt), "MMM d, h:mm a")}
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

