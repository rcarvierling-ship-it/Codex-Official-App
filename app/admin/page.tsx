import { format } from "date-fns";
import { sql } from "drizzle-orm";

import { Sidebar } from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getServerRole } from "@/lib/server-role";
import { db } from "@/server/db/client";
import { events, users, waitlist } from "@/server/db/schema";

async function getMetricCount<T>(table: T) {
  try {
    const result = await db.select({ value: sql<number>`count(*)` }).from(table as any);
    return Number(result[0]?.value ?? 0);
  } catch (error) {
    console.warn("[admin] count failed", error);
    return 0;
  }
}

async function getWaitlistEntries() {
  try {
    const rows = await db
      .select({
        id: waitlist.id,
        name: waitlist.name,
        email: waitlist.email,
        org: waitlist.org,
        role: waitlist.role,
        createdAt: waitlist.createdAt,
      })
      .from(waitlist)
      .orderBy(sql`"created_at" desc`)
      .limit(50);

    return rows;
  } catch (error) {
    console.warn("[admin] waitlist fetch failed", error);
    return [];
  }
}

export default async function AdminPage() {
  const role = await getServerRole();
  const [eventsCount, usersCount, waitlistCount, waitlistRows] = await Promise.all([
    getMetricCount(events),
    getMetricCount(users),
    getMetricCount(waitlist),
    getWaitlistEntries(),
  ]);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-4 py-12 lg:flex-row">
      <Sidebar initialRole={role} title="Operations" />
      <div className="flex-1 space-y-10">
        <header className="flex flex-col gap-3">
          <span className="text-xs uppercase tracking-[0.3em] text-[hsl(var(--accent))]">
            Admin / Overview
          </span>
          <h1 className="text-4xl font-semibold tracking-tight">Operations dashboard</h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Live data synced from Vercel Postgres. The waitlist form on the landing page funnels submissions here for review.
          </p>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="border border-[hsl(var(--accent)/0.3)] bg-card/80">
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Events</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-3xl font-semibold text-foreground">{eventsCount}</span>
              <p className="mt-1 text-xs text-muted-foreground">Total events in Postgres</p>
            </CardContent>
          </Card>

          <Card className="border border-border bg-card/80">
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Users</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-3xl font-semibold text-foreground">{usersCount}</span>
              <p className="mt-1 text-xs text-muted-foreground">Registered portal users</p>
            </CardContent>
          </Card>

          <Card className="border border-[hsl(var(--accent)/0.3)] bg-card/80">
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Waitlist</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-3xl font-semibold text-foreground">{waitlistCount}</span>
              <p className="mt-1 text-xs text-muted-foreground">High-intent prospects</p>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Latest waitlist entries</h2>
            <span className="text-xs text-muted-foreground">
              Showing {Math.min(waitlistRows.length, 50)} most recent submissions
            </span>
          </div>

          <div className="overflow-hidden rounded-2xl border border-border bg-card/80 shadow-lg">
            <div className="grid gap-0 border-b border-border bg-card/40 px-6 py-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">
              <div className="grid grid-cols-[1.2fr,1.2fr,1fr,0.8fr,0.8fr]">
                <span>Name</span>
                <span>Email</span>
                <span>Organization</span>
                <span>Role</span>
                <span>Joined</span>
              </div>
            </div>
            {waitlistRows.length === 0 ? (
              <div className="px-6 py-10 text-sm text-muted-foreground">
                No waitlist entries yet. Submit the form on the landing page to test the flow.
              </div>
            ) : (
              <ul className="divide-y divide-border/70">
                {waitlistRows.map((entry) => (
                  <li key={entry.id} className="grid grid-cols-[1.2fr,1.2fr,1fr,0.8fr,0.8fr] items-center gap-4 px-6 py-4 text-sm">
                    <span className="font-medium">{entry.name}</span>
                    <span className="truncate text-muted-foreground">{entry.email}</span>
                    <span className="truncate text-muted-foreground">{entry.org ?? "—"}</span>
                    <span className="rounded-full border border-[hsl(var(--accent)/0.3)] bg-[hsl(var(--accent)/0.1)] px-3 py-1 text-xs uppercase tracking-widest text-[hsl(var(--accent))]">
                      {entry.role ?? "n/a"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {entry.createdAt ? format(new Date(entry.createdAt), "MMM d, yyyy") : "—"}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
