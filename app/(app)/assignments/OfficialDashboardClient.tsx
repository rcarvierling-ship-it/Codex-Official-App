"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { AnimatedCard } from "@/components/animations/AnimatedCard";
import { StaggerContainer, StaggerItem } from "@/components/animations/StaggerContainer";
import { AnimatedNumber } from "@/components/animations/AnimatedNumber";
import { AnimatedButton } from "@/components/animations/AnimatedButton";
import { AvailabilityCalendar } from "@/components/availability/AvailabilityCalendar";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

type Event = {
  id: string;
  name: string;
  startsAt: string;
  endsAt?: string | null;
  schoolId: string | null;
  matchesAvailability?: boolean; // Added for auto-matching
};

type Request = {
  id: string;
  eventId: string;
  status: string;
  submittedAt: string;
  message?: string | null;
  event?: Event;
};

type Assignment = {
  id: string;
  eventId: string;
  role: string;
  status: string;
  createdAt: string;
  event?: Event;
};

type OfficialDashboardData = {
  myAssignments: Array<Assignment>;
  myRequests: Array<Request>;
  availableEvents: Event[];
  stats: {
    totalAssignments: number;
    pendingRequests: number;
    approvedRequests: number;
    availableEvents: number;
  };
  currentUserId: string;
};

export function OfficialDashboardClient({ data }: { data: OfficialDashboardData }) {
  const router = useRouter();
  const { toast } = useToast();
  const [requestingEventId, setRequestingEventId] = useState<string | null>(null);

  const handleRequestToWork = async (eventId: string) => {
    if (requestingEventId) return; // Prevent double-clicks

    setRequestingEventId(eventId);
    try {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to submit request");
      }

      toast({
        title: "Request submitted!",
        description: "Your request has been sent to the athletic director for review.",
      });

      router.refresh();
    } catch (error: any) {
      toast({
        title: "Request failed",
        description: error?.message || "Unable to submit request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setRequestingEventId(null);
    }
  };

  const hasPendingRequest = (eventId: string) => {
    return data.myRequests.some(
      (r) => r.eventId === eventId && r.status === "PENDING"
    );
  };

  const hasApprovedRequest = (eventId: string) => {
    return data.myRequests.some(
      (r) => r.eventId === eventId && r.status === "APPROVED"
    );
  };

  const hasAssignment = (eventId: string) => {
    return data.myAssignments.some((a) => a.eventId === eventId);
  };

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
        <h1 className="text-3xl font-semibold tracking-tight">Official Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Manage your assignments, submit work requests, and view upcoming events.
        </p>
      </motion.header>

      {/* Key Metrics */}
      <StaggerContainer className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StaggerItem>
          <AnimatedCard>
            <Card className="bg-card/80">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm text-muted-foreground">My Assignments</CardTitle>
                {data.stats.totalAssignments > 0 && (
                  <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40">
                    {data.stats.totalAssignments}
                  </Badge>
                )}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold text-foreground">
                  <AnimatedNumber value={data.stats.totalAssignments} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">Confirmed assignments</p>
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
                <CardTitle className="text-sm text-muted-foreground">Approved Requests</CardTitle>
                {data.stats.approvedRequests > 0 && (
                  <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40">
                    {data.stats.approvedRequests}
                  </Badge>
                )}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold text-foreground">
                  <AnimatedNumber value={data.stats.approvedRequests} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">Approved by AD</p>
              </CardContent>
            </Card>
          </AnimatedCard>
        </StaggerItem>

        <StaggerItem>
          <AnimatedCard>
            <Card className="bg-card/80">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm text-muted-foreground">Available Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold text-foreground">
                  <AnimatedNumber value={data.stats.availableEvents} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">Events you can request</p>
              </CardContent>
            </Card>
          </AnimatedCard>
        </StaggerItem>
      </StaggerContainer>

      {/* My Assignments Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-semibold tracking-tight">My Assignments</h2>
            <p className="text-sm text-muted-foreground">
              Confirmed assignments for upcoming events.
            </p>
          </motion.div>
          {data.stats.totalAssignments > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40">
                {data.stats.totalAssignments} confirmed
              </Badge>
            </motion.div>
          )}
        </div>

        {data.myAssignments.length === 0 ? (
          <AnimatedCard>
            <Card className="bg-card/80">
              <CardContent className="py-10 text-center text-sm text-muted-foreground">
                No assignments yet. Submit requests to work on events to get assigned.
              </CardContent>
            </Card>
          </AnimatedCard>
        ) : (
          <StaggerContainer className="grid gap-4 md:grid-cols-2" staggerDelay={0.05}>
            {data.myAssignments.map((assignment, index) => (
              <StaggerItem key={assignment.id}>
                <AnimatedCard>
                  <Card className="bg-card/80 border-emerald-500/20">
                    <CardHeader>
                      <CardTitle className="text-lg">
                        {assignment.event?.name ?? `Event ${assignment.eventId.slice(0, 8)}`}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground">
                        {assignment.event?.startsAt
                          ? format(new Date(assignment.event.startsAt), "MMM d, yyyy 'at' h:mm a")
                          : "Date TBD"}
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2">
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
                      <p className="text-xs text-muted-foreground">
                        Confirmed: {format(new Date(assignment.createdAt), "MMM d, h:mm a")}
                      </p>
                      {assignment.event && (
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button asChild variant="outline" size="sm" className="w-full">
                            <Link href={`/events/${assignment.event.id}`}>View Event</Link>
                          </Button>
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </AnimatedCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </div>

      {/* My Requests Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-2xl font-semibold tracking-tight">My Requests</h2>
            <p className="text-sm text-muted-foreground">
              Track the status of your work requests.
            </p>
          </motion.div>
        </div>

        {data.myRequests.length === 0 ? (
          <AnimatedCard>
            <Card className="bg-card/80">
              <CardContent className="py-10 text-center text-sm text-muted-foreground">
                No requests yet. Browse available events below to submit work requests.
              </CardContent>
            </Card>
          </AnimatedCard>
        ) : (
          <StaggerContainer className="grid gap-4 md:grid-cols-2" staggerDelay={0.05}>
            {data.myRequests.map((request, index) => (
              <StaggerItem key={request.id}>
                <AnimatedCard>
                  <Card className="bg-card/80">
                    <CardHeader>
                      <CardTitle className="text-lg">
                        {request.event?.name ?? `Event ${request.eventId.slice(0, 8)}`}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground">
                        Submitted: {format(new Date(request.submittedAt), "MMM d, h:mm a")}
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            request.status === "APPROVED"
                              ? "default"
                              : request.status === "DECLINED"
                              ? "destructive"
                              : "outline"
                          }
                          className="text-xs"
                        >
                          {request.status}
                        </Badge>
                        {request.status === "PENDING" && (
                          <span className="text-xs text-muted-foreground">
                            Awaiting AD review
                          </span>
                        )}
                      </div>
                      {request.message && (
                        <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
                          {request.message}
                        </p>
                      )}
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
        )}
      </div>

      {/* Available Events Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <h2 className="text-2xl font-semibold tracking-tight">Available Events</h2>
            <p className="text-sm text-muted-foreground">
              Browse events and request to work on them.
            </p>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button asChild variant="outline" size="sm">
              <Link href="/events">View All Events</Link>
            </Button>
          </motion.div>
        </div>

        {data.availableEvents.length === 0 ? (
          <AnimatedCard>
            <Card className="bg-card/80">
              <CardContent className="py-10 text-center text-sm text-muted-foreground">
                No available events at this time. Check back later for new opportunities.
              </CardContent>
            </Card>
          </AnimatedCard>
        ) : (
          <StaggerContainer className="grid gap-4 md:grid-cols-2 lg:grid-cols-3" staggerDelay={0.05}>
            {data.availableEvents.map((event, index) => {
              const hasPending = hasPendingRequest(event.id);
              const hasApproved = hasApprovedRequest(event.id);
              const hasAssigned = hasAssignment(event.id);
              const canRequest = !hasPending && !hasApproved && !hasAssigned;

              return (
                <StaggerItem key={event.id}>
                  <AnimatedCard>
                    <Card className={cn(
                      "bg-card/80",
                      event.matchesAvailability && "border-emerald-500/40 border-2"
                    )}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg">{event.name}</CardTitle>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(event.startsAt), "MMM d, yyyy 'at' h:mm a")}
                              {event.endsAt && ` - ${format(new Date(event.endsAt), "h:mm a")}`}
                            </p>
                          </div>
                          {event.matchesAvailability && (
                            <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 ml-2">
                              ✓ Matches Availability
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {hasAssigned && (
                          <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 w-full justify-center">
                            ✓ Assigned
                          </Badge>
                        )}
                        {hasApproved && (
                          <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/40 w-full justify-center">
                            ✓ Approved
                          </Badge>
                        )}
                        {hasPending && (
                          <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/40 w-full justify-center">
                            ⏳ Pending Review
                          </Badge>
                        )}
                        <div className="flex gap-2">
                          <motion.div
                            className="flex-1"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Button
                              asChild
                              variant="outline"
                              size="sm"
                              className="w-full"
                            >
                              <Link href={`/events/${event.id}`}>View Details</Link>
                            </Button>
                          </motion.div>
                          {canRequest && (
                            <motion.div
                              className="flex-1"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <AnimatedButton
                                size="sm"
                                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
                                onClick={() => handleRequestToWork(event.id)}
                                disabled={requestingEventId === event.id}
                              >
                                {requestingEventId === event.id
                                  ? "Submitting..."
                                  : "Request to Work"}
                              </AnimatedButton>
                            </motion.div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </AnimatedCard>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        )}
      </div>

      {/* Availability Calendar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <AvailabilityCalendar officialId={data.currentUserId} />
      </motion.div>

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
                  <Link href="/events">Browse Events</Link>
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

