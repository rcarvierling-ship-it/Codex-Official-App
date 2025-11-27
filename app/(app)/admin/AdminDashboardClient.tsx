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

type AdminDashboardData = {
  upcomingEvents: Event[];
  recentEvents: Event[];
  myTeams: Team[];
  eventRequests: Array<Request>;
  eventAssignments: Array<Assignment>;
  users: User[];
  stats: {
    totalEvents: number;
    totalTeams: number;
    totalUsers: number;
    pendingRequests: number;
    confirmedAssignments: number;
    activeOfficials: number;
    recentEventsCount: number;
  };
  schoolName?: string | null;
};

export function AdminDashboardClient({ data }: { data: AdminDashboardData }) {
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
        <h1 className="text-3xl font-semibold tracking-tight">
          {data.schoolName ? `${data.schoolName} Admin Dashboard` : "School Admin Dashboard"}
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your school's events, teams, users, and official assignments.
        </p>
      </motion.header>

      {/* Key Metrics */}
      <StaggerContainer className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StaggerItem>
          <AnimatedCard>
            <Card className="bg-card/80">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm text-muted-foreground">Total Events</CardTitle>
                {data.stats.recentEventsCount > 0 && (
                  <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/40">
                    {data.stats.recentEventsCount} recent
                  </Badge>
                )}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold text-foreground">
                  <AnimatedNumber value={data.stats.totalEvents} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">All events</p>
              </CardContent>
            </Card>
          </AnimatedCard>
        </StaggerItem>

        <StaggerItem>
          <AnimatedCard>
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
          <AnimatedCard>
            <Card className="bg-card/80">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm text-muted-foreground">Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold text-foreground">
                  <AnimatedNumber value={data.stats.totalUsers} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">Registered users</p>
              </CardContent>
            </Card>
          </AnimatedCard>
        </StaggerItem>

        <StaggerItem>
          <AnimatedCard>
            <Card className="bg-card/80">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm text-muted-foreground">Active Officials</CardTitle>
                {data.stats.activeOfficials > 0 && (
                  <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40">
                    {data.stats.activeOfficials}
                  </Badge>
                )}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold text-foreground">
                  <AnimatedNumber value={data.stats.activeOfficials} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">Officials available</p>
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
                <CardTitle className="text-sm text-muted-foreground">Confirmed Assignments</CardTitle>
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

      {/* Upcoming Events & Recent Events */}
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
                {data.upcomingEvents.slice(0, 5).map((event, index) => {
                  const eventRequests = data.eventRequests.filter((r) => r.eventId === event.id);
                  const eventAssignments = data.eventAssignments.filter((a) => a.eventId === event.id);
                  const pendingCount = eventRequests.filter((r) => r.status === "PENDING").length;
                  const assignedCount = eventAssignments.filter((a) => a.status === "ASSIGNED").length;

                  return (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.05 }}
                      whileHover={{ x: 4 }}
                      className="flex items-center justify-between rounded-lg border bg-background/60 p-3"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-foreground truncate">{event.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(event.startsAt), "MMM d, yyyy 'at' h:mm a")}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          {assignedCount > 0 && (
                            <Badge variant="outline" className="text-xs">
                              {assignedCount} Assigned
                            </Badge>
                          )}
                          {pendingCount > 0 && (
                            <Badge variant="outline" className="text-xs bg-amber-500/20 text-amber-300 border-amber-500/40">
                              {pendingCount} Pending
                            </Badge>
                          )}
                        </div>
                      </div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/events/${event.id}`}>View</Link>
                        </Button>
                      </motion.div>
                    </motion.div>
                  );
                })}
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
                  <CardTitle className="text-lg">Recent Events</CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">
                    Last {Math.min(5, data.recentEvents.length)} events
                  </p>
                </div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/events">View All</Link>
                  </Button>
                </motion.div>
              </CardHeader>
              <CardContent className="space-y-3">
                {data.recentEvents.slice(0, 5).map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                    whileHover={{ x: 4 }}
                    className="flex items-center justify-between rounded-lg border bg-background/60 p-3"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-foreground truncate">{event.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(event.startsAt), "MMM d, yyyy 'at' h:mm a")}
                      </p>
                    </div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/events/${event.id}`}>View</Link>
                      </Button>
                    </motion.div>
                  </motion.div>
                ))}
                {data.recentEvents.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">No recent events</p>
                )}
              </CardContent>
            </Card>
          </AnimatedCard>
        </StaggerItem>
      </StaggerContainer>

      {/* Teams & Users Overview */}
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
                    <Link href="/admin/teams">Manage</Link>
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
                  <CardTitle className="text-lg">Recent Users</CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">
                    Latest registered users
                  </p>
                </div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/admin/users">Manage</Link>
                  </Button>
                </motion.div>
              </CardHeader>
              <CardContent className="space-y-3">
                {data.users.slice(0, 5).map((user, index) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.05 }}
                    className="flex items-center justify-between rounded-lg border bg-background/60 p-2"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-foreground truncate">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                    <Badge variant="outline" className="text-xs ml-2">
                      {user.role || "USER"}
                    </Badge>
                  </motion.div>
                ))}
                {data.users.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">No users yet</p>
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
                Officials requesting to work on your school's events.
              </p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button asChild variant="outline" size="sm">
                <Link href="/approvals">Review All</Link>
              </Button>
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
                        <Badge variant="outline" className="text-xs">
                          Awaiting Approval
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

      {/* Quick Actions */}
      <AnimatedCard delay={0.9}>
        <Card className="bg-card/80">
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <AnimatedButton asChild variant="outline" className="w-full">
                  <Link href="/events">Manage Events</Link>
                </AnimatedButton>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <AnimatedButton asChild variant="outline" className="w-full">
                  <Link href="/admin/users">Manage Users</Link>
                </AnimatedButton>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <AnimatedButton asChild variant="outline" className="w-full">
                  <Link href="/analytics">View Analytics</Link>
                </AnimatedButton>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <AnimatedButton asChild variant="outline" className="w-full">
                  <Link href="/admin/settings">Settings</Link>
                </AnimatedButton>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <AnimatedButton asChild variant="outline" className="w-full">
                  <Link href="/admin/sports">Multi-Sport Dashboard</Link>
                </AnimatedButton>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <AnimatedButton asChild variant="outline" className="w-full">
                  <Link href="/admin/conflicts">Conflict Detection</Link>
                </AnimatedButton>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </AnimatedCard>
    </motion.div>
  );
}

