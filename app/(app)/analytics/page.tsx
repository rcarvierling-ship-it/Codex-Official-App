import { requireRole } from "@/lib/auth-helpers";
import { getEvents } from "@/lib/repos/events";
import { getRequests } from "@/lib/repos/requests";
import { getAssignments } from "@/lib/repos/assignments";
import { getUsers } from "@/lib/repos/users";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, subDays, startOfDay } from "date-fns";

export const metadata = { title: "Analytics" };
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  await requireRole("ADMIN");
  
  const [events, requests, assignments, users] = await Promise.all([
    getEvents(),
    getRequests(),
    getAssignments(),
    getUsers(),
  ]);

  const now = new Date();
  const last7Days = startOfDay(subDays(now, 7));
  const last30Days = startOfDay(subDays(now, 30));

  const recentEvents = events.filter(
    (e) => new Date(e.startsAt) >= last30Days
  ).length;

  const pendingRequests = requests.filter((r) => r.status === "PENDING").length;
  const approvedRequests = requests.filter((r) => r.status === "APPROVED").length;
  const activeAssignments = assignments.filter((a) => a.status === "ASSIGNED").length;
  const completedAssignments = assignments.filter((a) => a.status === "COMPLETED").length;
  const officials = users.filter((u) => u.role === "OFFICIAL" || !u.role).length;

  const approvalRate = requests.length > 0
    ? ((approvedRequests / requests.length) * 100).toFixed(1)
    : "0";

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Analytics</h1>
        <p className="text-sm text-muted-foreground">
          View insights and metrics about your organization's activity.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card/80">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Total Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-foreground">{events.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {recentEvents} in last 30 days
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/80">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Active Officials</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-foreground">{officials}</div>
            <p className="text-xs text-muted-foreground mt-1">Registered officials</p>
          </CardContent>
        </Card>

        <Card className="bg-card/80">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Pending Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-foreground">{pendingRequests}</div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card className="bg-card/80">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Approval Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-foreground">{approvalRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              {approvedRequests} of {requests.length} approved
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-card/80">
          <CardHeader>
            <CardTitle>Assignment Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Active</span>
              <span className="text-lg font-semibold text-foreground">{activeAssignments}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Completed</span>
              <span className="text-lg font-semibold text-foreground">{completedAssignments}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Cancelled</span>
              <span className="text-lg font-semibold text-foreground">
                {assignments.filter((a) => a.status === "CANCELLED").length}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/80">
          <CardHeader>
            <CardTitle>Request Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Pending</span>
              <span className="text-lg font-semibold text-foreground">{pendingRequests}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Approved</span>
              <span className="text-lg font-semibold text-foreground">{approvedRequests}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Declined</span>
              <span className="text-lg font-semibold text-foreground">
                {requests.filter((r) => r.status === "DECLINED").length}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

