"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AnimatedCard } from "@/components/animations/AnimatedCard";
import { StaggerContainer, StaggerItem } from "@/components/animations/StaggerContainer";
import { AnimatedNumber } from "@/components/animations/AnimatedNumber";
import { BrandedHeader } from "@/components/branding/BrandedHeader";
import { BrandedCard } from "@/components/branding/BrandedCard";
import { motion } from "framer-motion";

type Event = {
  id: string;
  name: string;
  startsAt: string;
};

type Request = {
  id: string;
  status: string;
  submittedAt: string;
};

type SchoolBranding = {
  name: string;
  logoUrl?: string | null;
  mascotName?: string | null;
  mascotImageUrl?: string | null;
  primaryColor?: string | null;
  secondaryColor?: string | null;
} | null;

type DashboardData = {
  events: Event[];
  pendingRequests: Request[];
  myAssignments: number;
  officials: number;
  branding?: SchoolBranding;
};

export function DashboardClient({ data }: { data: DashboardData }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      <header className="space-y-2">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl font-semibold tracking-tight"
        >
          Dashboard
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="text-sm text-muted-foreground"
        >
          Welcome back. Here's what's happening with your events and assignments.
        </motion.p>
      </header>

      <StaggerContainer className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StaggerItem>
          <AnimatedCard hover>
            <Card className="bg-card/80">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm text-muted-foreground">Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold text-foreground">
                  <AnimatedNumber value={data.events.length} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">Total events</p>
              </CardContent>
            </Card>
          </AnimatedCard>
        </StaggerItem>

        <StaggerItem>
          <AnimatedCard hover>
            <Card className="bg-card/80">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm text-muted-foreground">Pending Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold text-foreground">
                  <AnimatedNumber value={data.pendingRequests.length} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">Awaiting approval</p>
              </CardContent>
            </Card>
          </AnimatedCard>
        </StaggerItem>

        <StaggerItem>
          <AnimatedCard hover>
            <Card className="bg-card/80">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm text-muted-foreground">My Assignments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold text-foreground">
                  <AnimatedNumber value={data.myAssignments} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">Active assignments</p>
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
                  <AnimatedNumber value={data.officials} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">Registered officials</p>
              </CardContent>
            </Card>
          </AnimatedCard>
        </StaggerItem>
      </StaggerContainer>

      <StaggerContainer className="grid gap-6 lg:grid-cols-2" staggerDelay={0.1}>
        <StaggerItem>
          <AnimatedCard>
            <Card className="bg-card/80">
              <CardHeader>
                <CardTitle className="text-lg">Recent Events</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {data.events.slice(0, 5).map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    whileHover={{ x: 4 }}
                    className="flex items-center justify-between rounded-lg border bg-background/60 p-3"
                  >
                    <div>
                      <p className="font-medium text-foreground">{event.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(event.startsAt || Date.now()), "MMM d, yyyy 'at' h:mm a")}
                      </p>
                    </div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/events/${event.id}`}>View</Link>
                      </Button>
                    </motion.div>
                  </motion.div>
                ))}
                {data.events.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">No events yet</p>
                )}
              </CardContent>
            </Card>
          </AnimatedCard>
        </StaggerItem>

        <StaggerItem>
          <AnimatedCard>
            <Card className="bg-card/80">
              <CardHeader>
                <CardTitle className="text-lg">Pending Requests</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {data.pendingRequests.slice(0, 5).map((request, index) => (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    whileHover={{ x: 4 }}
                    className="flex items-center justify-between rounded-lg border bg-background/60 p-3"
                  >
                    <div>
                      <p className="font-medium text-foreground">Request #{request.id.slice(0, 8)}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(request.submittedAt || Date.now()), "MMM d, h:mm a")}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {request.status}
                    </Badge>
                  </motion.div>
                ))}
                {data.pendingRequests.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">No pending requests</p>
                )}
              </CardContent>
            </Card>
          </AnimatedCard>
        </StaggerItem>
      </StaggerContainer>
    </motion.div>
  );
}

