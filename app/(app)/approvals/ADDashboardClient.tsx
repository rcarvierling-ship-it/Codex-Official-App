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
import { ApproveRequestButton, DeclineRequestButton } from "./_components/RequestActions";
import { ChangeRequestCard } from "@/components/game-changes/ChangeRequestCard";

type Event = {
  id: string;
  name: string;
  startsAt: string;
  endsAt?: string | null;
  schoolId: string | null;
};

type Request = {
  id: string;
  userId: string;
  eventId: string;
  status: string;
  submittedAt: string;
  message?: string | null;
};

type Assignment = {
  id: string;
  eventId: string;
  userId: string;
  role: string;
  status: string;
};

type User = {
  id: string;
  name: string;
  email: string;
  role?: string | null;
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
    endsAt?: string | null;
    schoolId?: string | null;
  } | null;
  requester?: {
    id?: string;
    name: string;
    email: string;
  } | null;
};

type ADDashboardData = {
  pendingRequests: Array<Request & { user?: User; event?: Event }>;
  upcomingEvents: Event[];
  recentAssignments: Array<Assignment & { user?: User; event?: Event }>;
  teams: Team[];
  officials: User[];
  changeRequests: ChangeRequest[];
  stats: {
    totalPendingRequests: number;
    totalUpcomingEvents: number;
    totalTeams: number;
    totalOfficials: number;
    totalAssignments: number;
    pendingChangeRequests?: number;
  };
};

export function ADDashboardClient({ data }: { data: ADDashboardData }) {
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
        <h1 className="text-3xl font-semibold tracking-tight">Athletic Director Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Manage events, approve requests, and oversee your school's athletic operations.
        </p>
      </motion.header>

      {/* Key Metrics */}
      <StaggerContainer className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StaggerItem>
          <AnimatedCard hover>
            <Card className="bg-card/80">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm text-muted-foreground">Pending Approvals</CardTitle>
                {data.stats.totalPendingRequests > 0 && (
                  <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/40">
                    {data.stats.totalPendingRequests}
                  </Badge>
                )}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold text-foreground">
                  <AnimatedNumber value={data.stats.totalPendingRequests} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">Awaiting your review</p>
              </CardContent>
            </Card>
          </AnimatedCard>
        </StaggerItem>

        <StaggerItem>
          <AnimatedCard hover>
            <Card className="bg-card/80">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm text-muted-foreground">Upcoming Events</CardTitle>
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
          <AnimatedCard hover>
            <Card className="bg-card/80">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm text-muted-foreground">Teams</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold text-foreground">
                  <AnimatedNumber value={data.stats.totalTeams} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">Active teams</p>
              </CardContent>
            </Card>
          </AnimatedCard>
        </StaggerItem>

        <StaggerItem>
          <AnimatedCard hover>
            <Card className="bg-card/80">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm text-muted-foreground">Officials</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold text-foreground">
                  <AnimatedNumber value={data.stats.totalOfficials} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">Registered officials</p>
              </CardContent>
            </Card>
          </AnimatedCard>
        </StaggerItem>
      </StaggerContainer>

      {/* Pending Approvals Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-semibold tracking-tight">Pending Approvals</h2>
            <p className="text-sm text-muted-foreground">
              Review and approve work requests from officials.
            </p>
          </motion.div>
          {data.stats.totalPendingRequests > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/40">
                {data.stats.totalPendingRequests} pending
              </Badge>
            </motion.div>
          )}
        </div>

        {data.pendingRequests.length === 0 ? (
          <AnimatedCard>
            <Card className="bg-card/80">
              <CardContent className="py-10 text-center text-sm text-muted-foreground">
                No approvals waiting. When officials request assignments, they'll appear here.
              </CardContent>
            </Card>
          </AnimatedCard>
        ) : (
          <StaggerContainer className="grid gap-4 md:grid-cols-2" staggerDelay={0.05}>
            {data.pendingRequests.map((request, index) => (
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
                      <div className="flex gap-3">
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <ApproveRequestButton requestId={request.id} />
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <DeclineRequestButton requestId={request.id} />
                        </motion.div>
                      </div>
                    </CardContent>
                  </Card>
                </AnimatedCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </div>

      {/* Game Change Requests Section */}
      {data.changeRequests.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-2xl font-semibold tracking-tight">Game Change Requests</h2>
              <p className="text-sm text-muted-foreground">
                Review and approve change requests from coaches.
              </p>
            </motion.div>
            {(data.stats.pendingChangeRequests ?? 0) > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/40">
                  {data.stats.pendingChangeRequests ?? 0} Pending
                </Badge>
              </motion.div>
            )}
          </div>

          <StaggerContainer className="grid gap-4 md:grid-cols-2" staggerDelay={0.05}>
            {data.changeRequests.map((request, index) => (
              <StaggerItem key={request.id}>
                <ChangeRequestCard
                  request={request}
                  onStatusChange={() => window.location.reload()}
                  showActions={true}
                />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      )}

      {/* Upcoming Events & Recent Assignments */}
      <StaggerContainer className="grid gap-6 lg:grid-cols-2" staggerDelay={0.1}>
        <StaggerItem>
          <AnimatedCard>
            <Card className="bg-card/80">
              <CardHeader className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Upcoming Events</CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">
                    Next {Math.min(5, data.upcomingEvents.length)} events
                  </p>
                </div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/events">View All</Link>
                  </Button>
                </motion.div>
              </CardHeader>
              <CardContent className="space-y-3">
                {data.upcomingEvents.slice(0, 5).map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                    whileHover={{ x: 4 }}
                    className="flex items-center justify-between rounded-lg border bg-background/60 p-3"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{event.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(event.startsAt), "MMM d, yyyy 'at' h:mm a")}
                        {event.endsAt && ` - ${format(new Date(event.endsAt), "h:mm a")}`}
                      </p>
                    </div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/events/${event.id}`}>View</Link>
                      </Button>
                    </motion.div>
                  </motion.div>
                ))}
                {data.upcomingEvents.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">No upcoming events</p>
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
                    Latest confirmed assignments
                  </p>
                </div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/assignments">View All</Link>
                  </Button>
                </motion.div>
              </CardHeader>
              <CardContent className="space-y-3">
                {data.recentAssignments.slice(0, 5).map((assignment, index) => (
                  <motion.div
                    key={assignment.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                    whileHover={{ x: 4 }}
                    className="flex items-center justify-between rounded-lg border bg-background/60 p-3"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">
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
                {data.recentAssignments.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">No assignments yet</p>
                )}
              </CardContent>
            </Card>
          </AnimatedCard>
        </StaggerItem>
      </StaggerContainer>

      {/* Teams & Officials Overview */}
      <StaggerContainer className="grid gap-6 lg:grid-cols-2" staggerDelay={0.1}>
        <StaggerItem>
          <AnimatedCard>
            <Card className="bg-card/80">
              <CardHeader className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Teams</CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">
                    {data.stats.totalTeams} active teams
                  </p>
                </div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/teams">Manage</Link>
                  </Button>
                </motion.div>
              </CardHeader>
              <CardContent>
                {data.teams.length > 0 ? (
                  <div className="space-y-2">
                    {data.teams.slice(0, 5).map((team, index) => (
                      <motion.div
                        key={team.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.05 }}
                        className="flex items-center justify-between rounded-lg border bg-background/60 p-2"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-foreground truncate">{team.name}</p>
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
                    {data.teams.length > 5 && (
                      <p className="text-xs text-muted-foreground text-center pt-2">
                        +{data.teams.length - 5} more teams
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
                  <CardTitle className="text-lg">Officials Directory</CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">
                    {data.stats.totalOfficials} registered officials
                  </p>
                </div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/officials">View All</Link>
                  </Button>
                </motion.div>
              </CardHeader>
              <CardContent>
                {data.officials.length > 0 ? (
                  <div className="space-y-2">
                    {data.officials.slice(0, 5).map((official, index) => (
                      <motion.div
                        key={official.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.05 }}
                        className="flex items-center justify-between rounded-lg border bg-background/60 p-2"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-foreground truncate">
                            {official.name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">{official.email}</p>
                        </div>
                        <Badge variant="outline" className="text-xs ml-2">
                          Official
                        </Badge>
                      </motion.div>
                    ))}
                    {data.officials.length > 5 && (
                      <p className="text-xs text-muted-foreground text-center pt-2">
                        +{data.officials.length - 5} more officials
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No officials yet</p>
                )}
              </CardContent>
            </Card>
          </AnimatedCard>
        </StaggerItem>
      </StaggerContainer>

      {/* Quick Actions */}
      <AnimatedCard delay={0.7}>
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
                  <Link href="/requests">All Requests</Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/teams">Manage Teams</Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/announcements">Announcements</Link>
                </Button>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </AnimatedCard>
    </motion.div>
  );
}

