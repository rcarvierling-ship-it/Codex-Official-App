"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import Link from "next/link";
import { motion } from "framer-motion";
import { AnimatedCard } from "@/components/animations/AnimatedCard";
import { StaggerContainer, StaggerItem } from "@/components/animations/StaggerContainer";
import { AnimatedNumber } from "@/components/animations/AnimatedNumber";
import { AnimatedButton } from "@/components/animations/AnimatedButton";
import { ChangeRequestCard } from "@/components/game-changes/ChangeRequestCard";
import { BrandedHeader } from "@/components/branding/BrandedHeader";
import { BrandedCard } from "@/components/branding/BrandedCard";

type Event = {
  id: string;
  name: string;
  startsAt: string;
  endsAt?: string | null;
  schoolId: string | null;
};

type Request = {
  id: string;
  eventId: string;
  userId: string;
  status: string;
  submittedAt: string;
  message?: string | null;
  event?: Event;
  user?: { name: string; email: string };
};

type Assignment = {
  id: string;
  eventId: string;
  userId: string;
  role: string;
  status: string;
  createdAt: string;
  event?: Event;
  user?: { name: string; email: string };
};

type Team = {
  id: string;
  name: string;
  sport: string | null;
  level: string | null;
  schoolId: string | null;
};

type ChangeRequest = {
  id: string;
  eventId: string;
  changeType: string;
  currentValue: string | null;
  requestedValue: string | null;
  reason: string | null;
  status: string;
  createdAt: string;
  event?: {
    id: string;
    name: string;
    startsAt: string;
  } | null;
  requester?: {
    name: string;
    email: string;
  } | null;
};

type SchoolBranding = {
  name: string;
  logoUrl?: string | null;
  mascotName?: string | null;
  mascotImageUrl?: string | null;
  primaryColor?: string | null;
  secondaryColor?: string | null;
} | null;

type CoachDashboardData = {
  upcomingEvents: Event[];
  myTeams: Team[];
  eventRequests: Array<Request>;
  eventAssignments: Array<Assignment>;
  changeRequests: ChangeRequest[];
  stats: {
    totalUpcomingEvents: number;
    totalTeams: number;
    pendingRequests: number;
    confirmedAssignments: number;
    pendingChangeRequests: number;
  };
  branding?: SchoolBranding;
};

export function CoachDashboardClient({ data }: { data: CoachDashboardData }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      <motion.header
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-2"
      >
        <h1 className="text-3xl font-semibold tracking-tight">Coach Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Manage your teams, view upcoming events, and track official assignments.
        </p>
      </motion.header>

      {/* Key Metrics */}
      <StaggerContainer className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StaggerItem>
          <AnimatedCard>
            <Card className="bg-card/80">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm text-muted-foreground">Upcoming Events</CardTitle>
                {data.stats.totalUpcomingEvents > 0 && (
                  <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/40">
                    {data.stats.totalUpcomingEvents}
                  </Badge>
                )}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold text-foreground">
                  <AnimatedNumber value={data.stats.totalUpcomingEvents} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">Scheduled events</p>
              </CardContent>
            </Card>
          </AnimatedCard>
        </StaggerItem>

        <StaggerItem>
          <AnimatedCard>
            <Card className="bg-card/80">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm text-muted-foreground">My Teams</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold text-foreground">
                  <AnimatedNumber value={data.stats.totalTeams} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">Teams you coach</p>
              </CardContent>
            </Card>
          </AnimatedCard>
        </StaggerItem>

        <StaggerItem>
          <AnimatedCard>
            <Card className="bg-card/80">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm text-muted-foreground">Pending Requests</CardTitle>
                {data.stats.pendingRequests > 0 && (
                  <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/40">
                    {data.stats.pendingRequests}
                  </Badge>
                )}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold text-foreground">
                  <AnimatedNumber value={data.stats.pendingRequests} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">Awaiting approval</p>
              </CardContent>
            </Card>
          </AnimatedCard>
        </StaggerItem>

        <StaggerItem>
          <AnimatedCard>
            <Card className="bg-card/80">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm text-muted-foreground">Confirmed Officials</CardTitle>
                {data.stats.confirmedAssignments > 0 && (
                  <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40">
                    {data.stats.confirmedAssignments}
                  </Badge>
                )}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold text-foreground">
                  <AnimatedNumber value={data.stats.confirmedAssignments} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">Officials assigned</p>
              </CardContent>
            </Card>
          </AnimatedCard>
        </StaggerItem>
      </StaggerContainer>

      {/* Upcoming Events Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-semibold tracking-tight">Upcoming Events</h2>
            <p className="text-sm text-muted-foreground">
              Events for your teams in the next 30 days.
            </p>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button asChild variant="outline" size="sm">
              <Link href="/events">View All Events</Link>
            </Button>
          </motion.div>
        </div>

        {data.upcomingEvents.length === 0 ? (
          <AnimatedCard>
            <Card className="bg-card/80">
              <CardContent className="py-10 text-center text-sm text-muted-foreground">
                No upcoming events. Events for your teams will appear here.
              </CardContent>
            </Card>
          </AnimatedCard>
        ) : (
          <StaggerContainer className="grid gap-4 md:grid-cols-2 lg:grid-cols-3" staggerDelay={0.05}>
            {data.upcomingEvents.map((event, index) => {
              const eventRequests = data.eventRequests.filter((r) => r.eventId === event.id);
              const eventAssignments = data.eventAssignments.filter((a) => a.eventId === event.id);
              const pendingCount = eventRequests.filter((r) => r.status === "PENDING").length;
              const assignedCount = eventAssignments.filter((a) => a.status === "ASSIGNED").length;

              return (
                <StaggerItem key={event.id}>
                  <AnimatedCard>
                    <Card className="bg-card/80">
                      <CardHeader>
                        <CardTitle className="text-lg">{event.name}</CardTitle>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(event.startsAt), "MMM d, yyyy 'at' h:mm a")}
                          {event.endsAt && ` - ${format(new Date(event.endsAt), "h:mm a")}`}
                        </p>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          {assignedCount > 0 && (
                            <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-xs">
                              {assignedCount} Official{assignedCount !== 1 ? "s" : ""} Assigned
                            </Badge>
                          )}
                          {pendingCount > 0 && (
                            <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/40 text-xs">
                              {pendingCount} Pending
                            </Badge>
                          )}
                          {assignedCount === 0 && pendingCount === 0 && (
                            <Badge variant="outline" className="text-xs">
                              No Officials Yet
                            </Badge>
                          )}
                        </div>
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button asChild variant="outline" size="sm" className="w-full">
                            <Link href={`/events/${event.id}`}>View Details</Link>
                          </Button>
                        </motion.div>
                      </CardContent>
                    </Card>
                  </AnimatedCard>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        )}
      </div>

      {/* My Teams & Recent Assignments */}
      <StaggerContainer className="grid gap-6 lg:grid-cols-2" staggerDelay={0.1}>
        <StaggerItem>
          <AnimatedCard>
            <Card className="bg-card/80">
              <CardHeader className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">My Teams</CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">
                    {data.stats.totalTeams} team{data.stats.totalTeams !== 1 ? "s" : ""}
                  </p>
                </div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/teams">Manage Teams</Link>
                  </Button>
                </motion.div>
              </CardHeader>
              <CardContent>
                {data.myTeams.length > 0 ? (
                  <div className="space-y-2">
                    {data.myTeams.slice(0, 5).map((team, index) => (
                      <motion.div
                        key={team.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.05 }}
                        className="flex items-center justify-between rounded-lg border bg-background/60 p-3"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-foreground truncate">
                            {team.name}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            {team.sport && (
                              <Badge variant="outline" className="text-xs">
                                {team.sport}
                              </Badge>
                            )}
                            {team.level && (
                              <Badge variant="outline" className="text-xs">
                                {team.level}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    {data.myTeams.length > 5 && (
                      <p className="text-xs text-muted-foreground text-center pt-2">
                        +{data.myTeams.length - 5} more teams
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No teams yet</p>
                )}
              </CardContent>
            </Card>
          </AnimatedCard>
        </StaggerItem>

        <StaggerItem>
          <AnimatedCard>
            <Card className="bg-card/80">
              <CardHeader className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Recent Assignments</CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">
                    Officials confirmed for your events
                  </p>
                </div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/requests">View All</Link>
                  </Button>
                </motion.div>
              </CardHeader>
              <CardContent className="space-y-3">
                {data.eventAssignments.slice(0, 5).map((assignment, index) => (
                  <motion.div
                    key={assignment.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                    className="flex items-center justify-between rounded-lg border bg-background/60 p-3"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-foreground truncate">
                        {assignment.user?.name ?? "Unknown Official"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {assignment.event?.name ?? `Event ${assignment.eventId.slice(0, 8)}`}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {assignment.role}
                        </Badge>
                        <Badge
                          variant={assignment.status === "ASSIGNED" ? "default" : "outline"}
                          className="text-xs"
                        >
                          {assignment.status}
                        </Badge>
                      </div>
                    </div>
                  </motion.div>
                ))}
                {data.eventAssignments.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No assignments yet
                  </p>
                )}
              </CardContent>
            </Card>
          </AnimatedCard>
        </StaggerItem>
      </StaggerContainer>

      {/* Pending Requests Section */}
      {data.eventRequests.filter((r) => r.status === "PENDING").length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <h2 className="text-2xl font-semibold tracking-tight">Pending Requests</h2>
              <p className="text-sm text-muted-foreground">
                Officials requesting to work on your events.
              </p>
            </motion.div>
          </div>

          <StaggerContainer className="grid gap-4 md:grid-cols-2" staggerDelay={0.05}>
            {data.eventRequests
              .filter((r) => r.status === "PENDING")
              .slice(0, 6)
              .map((request, index) => (
                <StaggerItem key={request.id}>
                  <AnimatedCard>
                    <Card className="bg-card/80 border-amber-500/20">
                      <CardHeader>
                        <CardTitle className="text-lg">
                          {request.user?.name ?? "Unknown Official"}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground">
                          {request.event?.name ?? `Event ${request.eventId.slice(0, 8)}`} ·{" "}
                          {format(new Date(request.submittedAt), "MMM d, h:mm a")}
                        </p>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {request.message && (
                          <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
                            {request.message}
                          </p>
                        )}
                        <Badge variant="outline" className="text-xs">
                          Awaiting AD Approval
                        </Badge>
                        {request.event && (
                          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button asChild variant="outline" size="sm" className="w-full">
                              <Link href={`/events/${request.event.id}`}>View Event</Link>
                            </Button>
                          </motion.div>
                        )}
                      </CardContent>
                    </Card>
                  </AnimatedCard>
                </StaggerItem>
              ))}
          </StaggerContainer>
        </div>
      )}

      {/* My Change Requests */}
      {data.changeRequests.length > 0 && (
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 }}
            className="flex items-center gap-2"
          >
            <h2 className="text-2xl font-semibold tracking-tight">
              My Change Requests
            </h2>
            {data.stats.pendingChangeRequests > 0 && (
              <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/40">
                {data.stats.pendingChangeRequests} Pending
              </Badge>
            )}
          </motion.div>
          <StaggerContainer className="grid gap-4 md:grid-cols-2" staggerDelay={0.05}>
            {data.changeRequests.map((request) => (
              <StaggerItem key={request.id}>
                <ChangeRequestCard
                  request={request}
                  onStatusChange={() => window.location.reload()}
                  showActions={false}
                />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      )}

      {/* Quick Actions */}
      <AnimatedCard delay={0.9}>
        <Card className="bg-card/80">
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/events">View Events</Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/teams">Manage Teams</Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/requests">All Requests</Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/profile">My Profile</Link>
                </Button>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </AnimatedCard>
    </motion.div>
  );
}

