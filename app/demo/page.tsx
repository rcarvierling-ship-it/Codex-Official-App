'use client';

import { addDays, format, isWithinInterval } from "date-fns";
import Link from "next/link";
import { useMemo } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import {
  personaOptions,
  useDemoStore,
} from "./_state/demoStore";

const overviewKpis = [
  { label: "Total Users", value: "1,247", delta: "+12%" },
  { label: "Active Events", value: "89", delta: "+8%" },
  { label: "Assignments", value: "342", delta: "+15%" },
  { label: "Coverage Rate", value: "94%", delta: "+5%" },
];

const rosterPreview = [
  { number: " #23", name: "Michael Jordan", position: "Guard · Elite" },
  { number: " #11", name: "Kobe Bryant", position: "Guard · Varsity" },
  { number: " #35", name: "Kevin Durant", position: "Forward · Varsity" },
  { number: " #3", name: "Dwyane Wade", position: "Guard · Varsity" },
  { number: " #14", name: "Sabrina Ionescu", position: "Guard · Varsity" },
];

const schoolAnalytics = [
  { label: "Total Teams", value: "12" },
  { label: "Student Athletes", value: "156" },
  { label: "Upcoming Events", value: "48" },
  { label: "Pending Approvals", value: "3" },
];

export default function DemoOverviewPage() {
  const { toast } = useToast();
  const events = useDemoStore((state) => state.events);
  const teams = useDemoStore((state) => state.teams);
  const requests = useDemoStore((state) => state.requests);
  const activity = useDemoStore((state) => state.activity);
  const currentPersona = useDemoStore((state) => state.currentPersona);
  const currentRole = useDemoStore((state) => state.currentRole);
  const approveRequest = useDemoStore((state) => state.approveRequest);
  const declineRequest = useDemoStore((state) => state.declineRequest);
  const setPersona = useDemoStore((state) => state.setPersona);

  const personaMeta = personaOptions.find(
    (persona) => persona.label === currentPersona,
  );

  const pendingRequests = useMemo(
    () => requests.filter((request) => request.status === "PENDING").slice(0, 4),
    [requests],
  );

  const canApprove = ["SUPER_ADMIN", "ADMIN", "AD"].includes(currentRole);

  const upcomingEvents = useMemo(() => {
    const now = new Date();
    return [...events]
      .filter((event) =>
        isWithinInterval(new Date(event.start), {
          start: now,
          end: addDays(now, 7),
        }),
      )
      .sort(
        (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
      )
      .slice(0, 5);
  }, [events]);

  const recentActivity = activity.slice(0, 6);

  return (
    <div className="space-y-10">
      <header className="space-y-4">
        <p className="text-xs uppercase tracking-[0.3em] text-[hsl(var(--accent))]">
          Demo overview
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">
          Run leagues, schools, and officials from one command center.
        </h1>
        <p className="max-w-3xl text-sm text-muted-foreground">
          Switch personas to preview how athletic directors, school admins,
          officials, and coaches experience The Official App without touching your live data.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {overviewKpis.map((kpi) => (
          <Card
            key={kpi.label}
            className="border border-[hsl(var(--accent)/0.3)] bg-card/80"
          >
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  {kpi.label}
                </CardTitle>
                <p className="mt-2 text-3xl font-semibold text-foreground">
                  {kpi.value}
                </p>
              </div>
              <span className="rounded-full bg-[hsl(var(--accent)/0.2)] px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-[hsl(var(--accent))]">
                {kpi.delta}
              </span>
            </CardHeader>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
        <Card className="bg-card/80">
          <CardHeader>
            <CardTitle>Select role to explore</CardTitle>
            <p className="text-xs text-muted-foreground">
              Persona switcher updates actions across the demo instantly.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {personaOptions.map((persona) => {
                const isActive = persona.label === currentPersona;
                return (
                  <Badge
                    key={persona.label}
                    role="button"
                    tabIndex={0}
                    aria-pressed={isActive}
                    onClick={() => setPersona(persona.label)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setPersona(persona.label);
                      }
                    }}
                    className={
                      isActive
                        ? "cursor-pointer border border-[hsl(var(--accent)/0.4)] bg-[hsl(var(--accent)/0.15)] text-[hsl(var(--accent))]"
                        : "cursor-pointer border border-border/60 bg-background/60 text-muted-foreground hover:border-[hsl(var(--accent)/0.3)] hover:text-[hsl(var(--accent))]"
                    }
                  >
                    {persona.label}
                  </Badge>
                );
              })}
            </div>
            {personaMeta ? (
              <div className="space-y-3 rounded-xl border border-border/60 bg-background/70 p-4">
                <p className="text-sm font-semibold text-foreground">
                  {personaMeta.summary}
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {personaMeta.highlights.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[hsl(var(--accent))]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card className="bg-card/80">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Teams overview</CardTitle>
            <p className="text-xs text-muted-foreground">
              {teams.length} active teams
            </p>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {teams.slice(0, 12).map((team) => (
              <span
                key={team.id}
                className="rounded-full border border-border/70 bg-background/70 px-3 py-1 text-xs text-muted-foreground hover:border-[hsl(var(--accent)/0.4)] hover:text-[hsl(var(--accent))]"
              >
                {team.name}
              </span>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
        <Card className="bg-card/80">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Team roster preview</CardTitle>
            <span className="text-xs text-muted-foreground">
              Demo only · actions disabled
            </span>
          </CardHeader>
          <CardContent className="space-y-3">
            {rosterPreview.map((player) => (
              <div
                key={player.name}
                className="flex items-center justify-between rounded-xl border border-border/60 bg-background/60 px-4 py-3 text-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-[hsl(var(--accent))]">
                    {player.number}
                  </span>
                  <span className="text-foreground">{player.name}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {player.position}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-card/80">
          <CardHeader>
            <CardTitle>Upcoming events</CardTitle>
            <p className="text-xs text-muted-foreground">
              Next 7 days across the league
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingEvents.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No events scheduled in the next week.
              </p>
            ) : (
              upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="rounded-xl border border-border/50 bg-background/60 p-3 text-sm"
                >
                  <p className="font-semibold text-foreground">{event.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(event.start), "EEE, MMM d · h:mm a")} ·{" "}
                    {event.sport} · {event.level}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
        <Card className="bg-card/80">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Schedule approvals</CardTitle>
            <Button
              variant="outline"
              size="sm"
              className="border-[hsl(var(--accent)/0.3)] text-xs"
              asChild
            >
              <Link href="/demo/approvals">Open approvals</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingRequests.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                All requests are up to date.
              </p>
            ) : (
              pendingRequests.map((request) => {
                const event = events.find((e) => e.id === request.eventId);
                return (
                  <div
                    key={request.id}
                    className="rounded-xl border border-border/60 bg-background/70 p-4 text-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-foreground">
                          {event?.title ?? "Unknown event"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Requested{" "}
                          {format(
                            new Date(request.submittedAt),
                            "MMM d · h:mm a",
                          )}
                        </p>
                      </div>
                      <Badge className="bg-[hsl(var(--accent)/0.2)] text-[hsl(var(--accent))]">
                        Pending
                      </Badge>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {request.message ?? "No message provided."}
                    </p>
                    <div className="mt-3 flex gap-2">
                      <Button
                        size="sm"
                        className="bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))]"
                        disabled={!canApprove}
                        onClick={() => {
                          if (!canApprove) {
                            toast({
                              title: "Requires AD access",
                              description:
                                "Switch to a School Admin or Athletic Director persona to approve.",
                            });
                            return;
                          }
                          approveRequest(request.id);
                          toast({
                            title: "Request approved",
                            description: `${event?.title ?? "Event"} now has confirmed coverage.`,
                          });
                        }}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-500/40 text-red-300 hover:bg-red-500/10"
                        disabled={!canApprove}
                        onClick={() => {
                          if (!canApprove) {
                            toast({
                              title: "Requires AD access",
                              description:
                                "Switch to a School Admin or Athletic Director persona to decline.",
                            });
                            return;
                          }
                          declineRequest(request.id);
                          toast({
                            title: "Request declined",
                            description: "The requester was notified immediately.",
                          });
                        }}
                      >
                        Deny
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        <Card className="bg-card/80">
          <CardHeader>
            <CardTitle>School analytics</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {schoolAnalytics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-xl border border-border/60 bg-background/60 px-4 py-3"
              >
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  {metric.label}
                </p>
                <p className="mt-2 text-xl font-semibold text-foreground">
                  {metric.value}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
        <Card className="bg-card/80">
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivity.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Interact with the demo to populate the log.
              </p>
            ) : (
              recentActivity.map((entry) => (
                <div
                  key={entry.id}
                  className="rounded-xl border border-border/60 bg-background/60 px-4 py-3 text-sm"
                >
                  <p className="text-foreground">{entry.message}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(entry.timestamp), "MMM d · h:mm a")}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
        <Card className="flex items-center justify-between bg-card/80 px-6 py-8">
          <div>
            <h3 className="text-xl font-semibold text-foreground">
              Ready to get started?
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Join the waitlist to be among the first to deploy The Official App.
            </p>
          </div>
          <Button
            asChild
            className="bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))]"
          >
            <Link href="/#waitlist">Join the Waitlist</Link>
          </Button>
        </Card>
      </section>
    </div>
  );
}
