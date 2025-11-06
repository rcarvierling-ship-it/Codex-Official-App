'use client';

import { format } from "date-fns";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { useEventDetails } from "../../_state/hooks";
import { useDemoStore } from "../../_state/demoStore";

export default function DemoEventDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const details = useEventDetails(id);
  const requestToWork = useDemoStore((state) => state.requestToWork);
  const approveRequest = useDemoStore((state) => state.approveRequest);
  const declineRequest = useDemoStore((state) => state.declineRequest);
  const updateNotes = useDemoStore((state) => state.updateNotes);
  const currentRole = useDemoStore((state) => state.currentRole);
  const activeUserId = useDemoStore((state) => state.activeUserId);
  const featureFlags = useDemoStore((state) => state.featureFlags);
  const { toast } = useToast();
  const [notesDraft, setNotesDraft] = useState(details?.notes ?? "");
  const [activeTab, setActiveTab] = useState<"overview" | "assignments" | "requests" | "messaging" | "notes">("overview");

  useEffect(() => {
    setNotesDraft(details?.notes ?? "");
  }, [details?.notes]);

  const event = details?.event;

  const canRequestWork = useMemo(() => {
    if (!details) return false;
    if (currentRole !== "OFFICIAL") return false;
    return !details.requests.some(
      (request) =>
        request.user?.id === activeUserId && request.status === "PENDING",
    );
  }, [details, currentRole, activeUserId]);

  const hasPendingRequest = useMemo(() => {
    if (!details) return false;
    return details.requests.some(
      (request) =>
        request.user?.id === activeUserId && request.status === "PENDING",
    );
  }, [details, activeUserId]);

  const canApprove = ["SUPER_ADMIN", "ADMIN", "AD"].includes(currentRole);

  if (!details || !event) {
    return (
      <div className="space-y-4">
        <Card className="bg-card/80">
          <CardHeader>
            <CardTitle>Event not found</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            That demo event isn&apos;t seeded yet. Head back to the{" "}
            <Link href="/demo/events" className="text-[hsl(var(--accent))]">
              events list
            </Link>{" "}
            to choose another matchup.
          </CardContent>
        </Card>
      </div>
    );
  }

  const homeTeamName = details.homeTeam?.name ?? "Home";
  const awayTeamName = details.awayTeam?.name ?? "Away";

  const handleRequestToWork = () => {
    requestToWork(event.id);
    toast({
      title: "Request sent",
      description: `You're now pending for ${event.title}.`,
    });
    setActiveTab("requests");
  };

  const handleSaveNotes = () => {
    updateNotes(event.id, notesDraft);
    toast({
      title: "Notes updated",
      description: "Internal notes persist locally for your demo session.",
    });
  };

  return (
    <div className="space-y-8">
      <header className="space-y-4">
        <nav className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Demo / Events / {event.title}
        </nav>
        <div className="flex flex-col gap-4 rounded-3xl border border-border/60 bg-card/80 p-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">
              <span>{event.sport}</span>
              <span>•</span>
              <span>{event.level}</span>
              <span>•</span>
              <span>{details.league?.name ?? "League"}</span>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight">
              {homeTeamName} vs {awayTeamName}
            </h1>
            <p className="text-sm text-muted-foreground">
              {format(new Date(event.start), "EEE, MMM d · h:mm a")} —
              {" "}
              {details.venue?.name ?? "Venue"} · {details.venue?.city},{" "}
              {details.venue?.state}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Badge className="bg-[hsl(var(--accent)/0.2)] text-[hsl(var(--accent))]">
                {event.status}
              </Badge>
              {featureFlags.BETA_ANALYTICS ? (
                <Badge className="bg-sky-500/20 text-sky-300">
                  Beta analytics signal: win probability 62% home
                </Badge>
              ) : null}
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              className="bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))]"
              disabled={!canRequestWork}
              onClick={handleRequestToWork}
            >
              {hasPendingRequest ? "Request pending" : "Request to work"}
            </Button>
            <Button
              variant="outline"
              asChild
              className="border-[hsl(var(--accent)/0.4)]"
            >
              <Link href="/demo/events">Back to events</Link>
            </Button>
          </div>
        </div>
        <Alert className="border-[hsl(var(--accent)/0.4)] bg-[hsl(var(--accent)/0.08)] text-sm">
          <AlertTitle>Realtime updates simulate instantly</AlertTitle>
          <AlertDescription>
            Approvals, assignments, and notes you change here propagate across the in-memory demo so other tabs reflect them right away.
          </AlertDescription>
        </Alert>
      </header>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)}>
        <TabsList className="grid w-full grid-cols-5 rounded-2xl bg-card/80 p-1 text-xs uppercase tracking-[0.3em]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="requests">
            Requests
            {details.requests.filter((request) => request.status === "PENDING").length > 0 ? (
              <span className="ml-2 rounded-full bg-[hsl(var(--accent))] px-2 py-0.5 text-[10px] text-[hsl(var(--accent-foreground))]">
                {details.requests.filter((request) => request.status === "PENDING").length}
              </span>
            ) : null}
          </TabsTrigger>
          <TabsTrigger value="messaging">Messaging</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-4">
          <Card className="bg-card/80">
            <CardHeader>
              <CardTitle>Event overview</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <OverviewField label="League" value={details.league?.name ?? "—"} />
              <OverviewField label="Hosted by" value={details.school?.name ?? "—"} />
              <OverviewField
                label="Start"
                value={format(new Date(event.start), "MMM d, yyyy · h:mm a")}
              />
              <OverviewField
                label="End"
                value={format(new Date(event.end), "MMM d, yyyy · h:mm a")}
              />
              <OverviewField label="Venue" value={details.venue?.name ?? "—"} />
              <OverviewField label="Created by" value={event.createdBy ?? "—"} />
            </CardContent>
          </Card>
          <Card className="bg-card/80">
            <CardHeader>
              <CardTitle>Officials coverage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                {details.assignments.length > 0
                  ? `${details.assignments.length} assignment${
                      details.assignments.length > 1 ? "s are" : " is"
                    } confirmed.`
                  : "No officials assigned yet."}
              </p>
              <p>
                Pending requests:{" "}
                {details.requests.filter((request) => request.status === "PENDING").length}
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assignments" className="mt-6">
          <Card className="bg-card/80">
            <CardHeader>
              <CardTitle>Confirmed assignments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {details.assignments.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No assignments yet. Approve a request to create an assignment automatically.
                </p>
              ) : (
                details.assignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="flex items-center justify-between rounded-xl border border-border/60 bg-background/70 px-4 py-3 text-sm"
                  >
                    <div>
                      <p className="font-semibold text-foreground">
                        {assignment.user?.name ?? "Official"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {assignment.position}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Confirmed {format(new Date(assignment.confirmedAt), "MMM d · h:mm a")}
                    </p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requests" className="mt-6 space-y-4">
          {details.requests.length === 0 ? (
            <Card className="bg-card/80">
              <CardContent className="py-10 text-center text-sm text-muted-foreground">
                No requests yet. Officials can request coverage directly from the events list.
              </CardContent>
            </Card>
          ) : (
            details.requests.map((request) => (
              <Card key={request.id} className="bg-card/80">
                <CardHeader>
                  <CardTitle className="text-base">
                    {request.user?.name ?? "Official"} ·{" "}
                    <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                      {request.status}
                    </span>
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">
                    Submitted {format(new Date(request.submittedAt), "MMM d · h:mm a")}
                  </p>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <p>{request.message ?? "No additional message."}</p>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      className={cn(
                        "px-3 py-1 text-xs",
                        request.status === "APPROVED" && "bg-emerald-500/20 text-emerald-300",
                        request.status === "DECLINED" && "bg-red-500/20 text-red-300",
                        request.status === "PENDING" && "bg-[hsl(var(--accent)/0.2)] text-[hsl(var(--accent))]",
                      )}
                    >
                      {request.status}
                    </Badge>
                    {request.user?.sports ? (
                      <span>{request.user.sports.join(" • ")}</span>
                    ) : null}
                  </div>
                  {request.status === "PENDING" ? (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30"
                        disabled={!canApprove}
                        onClick={() => {
                          if (!canApprove) {
                            toast({
                              title: "Requires AD permissions",
                              description: "Switch to a School Admin or AD persona to approve.",
                            });
                            return;
                          }
                          approveRequest(request.id);
                          toast({
                            title: "Approved",
                            description: `${request.user?.name ?? "Official"} assigned to ${event.title}.`,
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
                              title: "Requires AD permissions",
                              description: "Switch to a School Admin or AD persona to decline.",
                            });
                            return;
                          }
                          declineRequest(request.id);
                          toast({
                            title: "Declined",
                            description: `${request.user?.name ?? "Official"} was notified.`,
                          });
                        }}
                      >
                        Decline
                      </Button>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="messaging" className="mt-6">
          <Card className="bg-card/80">
            <CardHeader>
              <CardTitle>Message center</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Messaging is read-only in the demo. In production this space pulls from the real-time channel you configure (Pusher or Ably).
              </p>
              <div className="space-y-2 rounded-xl border border-border/60 bg-background/70 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  Latest broadcast
                </p>
                <p className="text-foreground">
                  “Officials, arrive 45 minutes early for bench checks and captains meeting.”
                </p>
                <p className="text-xs text-muted-foreground">Sent by Jordan Fisher · 2h ago</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="mt-6">
          <Card className="bg-card/80">
            <CardHeader>
              <CardTitle>Internal notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                value={notesDraft}
                onChange={(event) => setNotesDraft(event.target.value)}
                placeholder="Share context, special instructions, or reminders. Saved locally in demo mode."
                className="min-h-[180px] bg-background"
              />
              <div className="flex gap-2">
                <Button
                  className="bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))]"
                  onClick={handleSaveNotes}
                >
                  Save notes
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setNotesDraft(details.notes)}
                >
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function OverviewField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="space-y-1">
      <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
        {label}
      </p>
      <p className="text-sm text-foreground">{value}</p>
    </div>
  );
}
