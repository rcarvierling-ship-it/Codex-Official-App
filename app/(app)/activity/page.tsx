import { requireRole } from "@/lib/auth-helpers";
import { getEvents } from "@/lib/repos/events";
import { getRequests } from "@/lib/repos/requests";
import { getAssignments } from "@/lib/repos/assignments";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { sql } from "@/lib/db";

export const metadata = { title: "Activity" };
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function getActivityLogs() {
  try {
    const { rows } = await sql`select * from activity_logs order by created_at desc limit 100`;
    return rows.map((r: any) => ({
      id: String(r.id ?? r.log_id ?? crypto.randomUUID()),
      action: String(r.action ?? r.type ?? "Unknown"),
      userId: r.user_id ?? r.user ?? null,
      entityType: r.entity_type ?? r.entity ?? null,
      entityId: r.entity_id ?? null,
      details: r.details ?? r.metadata ?? null,
      createdAt: String(r.created_at ?? r.timestamp ?? new Date().toISOString()),
    }));
  } catch {
    // Fallback: create activity from recent events, requests, assignments
    const [events, requests, assignments] = await Promise.all([
      getEvents(),
      getRequests(),
      getAssignments(),
    ]);

    const activities = [
      ...events.slice(0, 20).map((e) => ({
        id: `event-${e.id}`,
        action: "Event Created",
        userId: null,
        entityType: "event",
        entityId: e.id,
        details: { name: e.name },
        createdAt: e.startsAt,
      })),
      ...requests.slice(0, 20).map((r) => ({
        id: `request-${r.id}`,
        action: `Request ${r.status}`,
        userId: r.userId,
        entityType: "request",
        entityId: r.id,
        details: { status: r.status },
        createdAt: r.submittedAt,
      })),
      ...assignments.slice(0, 20).map((a) => ({
        id: `assignment-${a.id}`,
        action: `Assignment ${a.status}`,
        userId: a.userId,
        entityType: "assignment",
        entityId: a.id,
        details: { status: a.status, role: a.role },
        createdAt: a.createdAt,
      })),
    ];

    return activities.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ).slice(0, 50);
  }
}

export default async function ActivityPage() {
  await requireRole("ADMIN");
  const activities = await getActivityLogs();

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Activity</h1>
        <p className="text-sm text-muted-foreground">
          View recent activity and changes across your organization.
        </p>
      </header>

      {activities.length === 0 ? (
        <Card className="bg-card/80">
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            No activity logs found.
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-card/80">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border/60 text-sm">
                <thead className="bg-background/60 text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 text-left">Action</th>
                    <th className="px-4 py-3 text-left">Entity</th>
                    <th className="px-4 py-3 text-left">User</th>
                    <th className="px-4 py-3 text-left">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {activities.map((activity) => (
                    <tr key={activity.id} className="text-muted-foreground">
                      <td className="px-4 py-3">
                        <Badge variant="outline" className="text-xs">
                          {activity.action}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        {activity.entityType && (
                          <span className="text-xs uppercase">{activity.entityType}</span>
                        )}
                        {activity.entityId && (
                          <span className="text-xs text-muted-foreground ml-2">
                            {activity.entityId.slice(0, 8)}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {activity.userId ? (
                          <span className="text-xs">{activity.userId.slice(0, 8)}</span>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs">
                        {format(new Date(activity.createdAt), "MMM d, h:mm a")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

