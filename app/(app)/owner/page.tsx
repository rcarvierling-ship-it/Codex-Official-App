import { requireOwner } from "@/lib/auth-helpers";
import { getSessionServer } from "@/lib/auth";
import { getEvents } from "@/lib/repos/events";
import { getUsers } from "@/lib/repos/users";
import { getRequests } from "@/lib/repos/requests";
import { getAssignments } from "@/lib/repos/assignments";
import { sql } from "@/lib/db";
import { hasDbEnv } from "@/lib/db";
import { format, subDays, startOfDay } from "date-fns";
import { OwnerPageClient } from "./OwnerPageClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { SessionUser } from "@/lib/types/auth";

export const metadata = { title: "Owner Dashboard" };
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function OwnerPage() {
  let session;
  let error: string | null = null;
  
  try {
    session = await requireOwner();
  } catch (err: any) {
    error = err?.message || "Unable to verify owner access";
    // Still try to get session for display
    try {
      const { getSessionServer } = await import("@/lib/auth");
      session = await getSessionServer();
    } catch {
      // Ignore
    }
  }

  if (error || !session) {
    return (
      <div className="space-y-8">
        <Card className="bg-card/80 border-red-500/40">
          <CardHeader>
            <CardTitle className="text-lg text-red-400">Access Denied</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">{error || "Unable to verify owner access"}</p>
            <div className="space-y-2 text-sm">
              <p className="font-semibold">To access this page:</p>
              <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                <li>Set the <code className="bg-muted px-1 rounded">OWNER_EMAIL</code> environment variable to your email address</li>
                <li>Make sure you're logged in with that email address</li>
                <li>Restart your development server or redeploy on Vercel</li>
              </ol>
              {session && (
                <div className="mt-4 p-3 bg-muted rounded">
                  <p className="text-xs text-muted-foreground">Current logged in email:</p>
                  <p className="text-sm font-medium">{(session.user as SessionUser)?.email || "Not available"}</p>
                </div>
              )}
            </div>
            <Button asChild variant="outline">
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const user = session.user as SessionUser;

  // Fetch database statistics and table information
  let dbStats = {
    totalUsers: 0,
    totalEvents: 0,
    totalRequests: 0,
    totalAssignments: 0,
    totalSchools: 0,
    waitlistEntries: 0,
  };

  let dbTables: Array<{ name: string; count: number }> = [];
  let chartData = {
    userGrowth: [] as Array<{ date: string; count: number }>,
    roleDistribution: [] as Array<{ name: string; value: number }>,
    requestStatus: [] as Array<{ name: string; value: number }>,
    assignmentStatus: [] as Array<{ name: string; value: number }>,
    eventsOverTime: [] as Array<{ date: string; count: number }>,
  };

  // Additional data for owner page
  let recentUsers: Array<{ id: string; name: string; email: string; role: string; createdAt: string }> = [];
  let recentActivity: Array<{ id: string; action: string; entity: string; ts: string }> = [];
  let recentWaitlist: Array<{ id: string; name: string; email: string; createdAt: string }> = [];
  let featureFlags: Array<{ key: string; value: any }> = [];

  try {
    if (hasDbEnv) {
      const [events, users, requests, assignments] = await Promise.all([
        getEvents(null), // null means no filter - see all
        getUsers(),
        getRequests(),
        getAssignments(),
      ]);

      dbStats.totalEvents = events.length;
      dbStats.totalUsers = users.length;
      dbStats.totalRequests = requests.length;
      dbStats.totalAssignments = assignments.length;

      // Get all table names and row counts using pg_stat_user_tables (fast and efficient)
      try {
        const { rows: tableStats } = await sql<{ relname: string; n_live_tup: number }>`
          SELECT 
            relname as relname,
            n_live_tup::int as n_live_tup
          FROM pg_stat_user_tables
          WHERE schemaname = 'public'
          ORDER BY relname
        `;
        
        dbTables = tableStats.map(row => ({
          name: row.relname,
          count: Number(row.n_live_tup || 0),
        }));
      } catch {
        // Fallback: use data we already have for known tables
        dbTables = [
          { name: 'users', count: users.length },
          { name: 'events', count: events.length },
          { name: 'requests', count: requests.length },
          { name: 'assignments', count: assignments.length },
          { name: 'schools', count: dbStats.totalSchools },
          { name: 'waitlist', count: dbStats.waitlistEntries },
        ];
        
        // Also try to get list of all tables even if we can't get counts
        try {
          const { rows: allTables } = await sql<{ table_name: string }>`
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
            ORDER BY table_name
          `;
          
          // Add tables we haven't already added
          for (const table of allTables) {
            if (!dbTables.find(t => t.name === table.table_name)) {
              dbTables.push({ name: table.table_name, count: -1 });
            }
          }
        } catch {
          // Ignore if we can't get table list
        }
      }

      // Get school count
      try {
        const { rows: schoolRows } = await sql<{ count: number }>`
          SELECT COUNT(*) as count FROM schools
        `;
        dbStats.totalSchools = Number(schoolRows[0]?.count || 0);
      } catch {
        // Ignore if schools table doesn't exist
      }

      // Get waitlist count
      try {
        const { rows: waitlistRows } = await sql<{ count: number }>`
          SELECT COUNT(*) as count FROM waitlist
        `;
        dbStats.waitlistEntries = Number(waitlistRows[0]?.count || 0);
      } catch {
        // Ignore if waitlist table doesn't exist
      }

      // Prepare chart data
      // User growth over last 30 days
      const now = new Date();
      const last30Days = Array.from({ length: 30 }, (_, i) => {
        const date = subDays(now, 29 - i);
        return format(startOfDay(date), "MMM d");
      });

      try {
        const { rows: userGrowthRows } = await sql<{ date: string; count: number }>`
          SELECT 
            DATE(created_at) as date,
            COUNT(*) as count
          FROM users
          WHERE created_at >= ${subDays(now, 30).toISOString()}
          GROUP BY DATE(created_at)
          ORDER BY date
        `;
        
        const growthMap = new Map(userGrowthRows.map(r => [r.date, Number(r.count || 0)]));
        let cumulative = 0;
        chartData.userGrowth = last30Days.map(date => {
          const dateStr = format(new Date(date), "yyyy-MM-dd");
          cumulative += growthMap.get(dateStr) || 0;
          return { date, count: cumulative };
        });
      } catch {
        // Fallback: use total users
        chartData.userGrowth = last30Days.map(date => ({ date, count: users.length }));
      }

      // Role distribution
      const roleCounts = new Map<string, number>();
      users.forEach(user => {
        const role = user.role || "USER";
        roleCounts.set(role, (roleCounts.get(role) || 0) + 1);
      });
      chartData.roleDistribution = Array.from(roleCounts.entries()).map(([name, value]) => ({
        name: name === "SUPER_ADMIN" ? "Super Admin" : name === "AD" ? "Athletic Director" : name,
        value,
      }));

      // Request status breakdown
      const requestStatusCounts = new Map<string, number>();
      requests.forEach(req => {
        const status = req.status || "PENDING";
        requestStatusCounts.set(status, (requestStatusCounts.get(status) || 0) + 1);
      });
      chartData.requestStatus = Array.from(requestStatusCounts.entries()).map(([name, value]) => ({
        name,
        value,
      }));

      // Assignment status breakdown
      const assignmentStatusCounts = new Map<string, number>();
      assignments.forEach(assign => {
        const status = assign.status || "ASSIGNED";
        assignmentStatusCounts.set(status, (assignmentStatusCounts.get(status) || 0) + 1);
      });
      chartData.assignmentStatus = Array.from(assignmentStatusCounts.entries()).map(([name, value]) => ({
        name,
        value,
      }));

      // Events over time (last 30 days)
      try {
        const { rows: eventsOverTimeRows } = await sql<{ date: string; count: number }>`
          SELECT 
            DATE(start_ts) as date,
            COUNT(*) as count
          FROM events
          WHERE start_ts >= ${subDays(now, 30).toISOString()}
          GROUP BY DATE(start_ts)
          ORDER BY date
        `;
        
        const eventsMap = new Map(eventsOverTimeRows.map(r => [r.date, Number(r.count || 0)]));
        chartData.eventsOverTime = last30Days.map(date => {
          const dateStr = format(new Date(date), "yyyy-MM-dd");
          return { date, count: eventsMap.get(dateStr) || 0 };
        });
      } catch {
        // Fallback
        chartData.eventsOverTime = last30Days.map(date => ({ date, count: 0 }));
      }

      // Get recent users (last 10)
      try {
        const { rows: recentUsersRows } = await sql<{ id: string; name: string; email: string; role: string; created_at: string }>`
          SELECT id, name, email, role, created_at
          FROM users
          ORDER BY created_at DESC
          LIMIT 10
        `;
        recentUsers = recentUsersRows.map(r => ({
          id: r.id,
          name: r.name || "Unknown",
          email: r.email,
          role: r.role || "USER",
          createdAt: r.created_at,
        }));
      } catch {
        // Fallback: use users array
        recentUsers = users.slice(0, 10).map(u => ({
          id: u.id,
          name: u.name || "Unknown",
          email: u.email,
          role: (u as any).role || "USER",
          createdAt: new Date().toISOString(),
        }));
      }

      // Get recent audit logs (last 20)
      try {
        const { rows: auditRows } = await sql<{ id: string; action: string; entity: string; ts: string }>`
          SELECT id, action, entity, ts
          FROM audit_logs
          ORDER BY ts DESC
          LIMIT 20
        `;
        recentActivity = auditRows.map(r => ({
          id: r.id,
          action: r.action || "Unknown",
          entity: r.entity || "N/A",
          ts: r.ts,
        }));
      } catch {
        // If audit_logs doesn't exist, create from recent events/requests
        recentActivity = [
          ...events.slice(0, 10).map(e => ({
            id: e.id,
            action: "Event Created",
            entity: "event",
            ts: e.startsAt,
          })),
          ...requests.slice(0, 10).map(r => ({
            id: r.id,
            action: `Request ${r.status}`,
            entity: "request",
            ts: r.submittedAt || new Date().toISOString(),
          })),
        ].slice(0, 20);
      }

      // Get recent waitlist entries (last 10)
      try {
        const { rows: waitlistRows } = await sql<{ id: string; name: string; email: string; created_at: string }>`
          SELECT id, name, email, created_at
          FROM waitlist
          ORDER BY created_at DESC
          LIMIT 10
        `;
        recentWaitlist = waitlistRows.map(r => ({
          id: r.id,
          name: r.name,
          email: r.email,
          createdAt: r.created_at,
        }));
      } catch {
        // Waitlist table might not exist
        recentWaitlist = [];
      }

      // Get feature flags
      try {
        const { rows: flagsRows } = await sql<{ key: string; value_json: any }>`
          SELECT key, value_json
          FROM feature_flags
          ORDER BY updated_at DESC
          LIMIT 10
        `;
        featureFlags = flagsRows.map(r => ({
          key: r.key,
          value: r.value_json,
        }));
      } catch {
        // Feature flags might not exist
        featureFlags = [];
      }
    }
  } catch (error) {
    console.error("[owner] Failed to fetch database stats:", error);
  }

  return (
    <OwnerPageClient
      data={{
        user: {
          name: user?.name,
          email: user?.email,
          role: user?.role,
        },
        dbStats,
        dbTables,
        chartData,
        recentUsers,
        recentActivity,
        recentWaitlist,
        featureFlags,
      }}
    />
  );
}
