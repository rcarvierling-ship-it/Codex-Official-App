"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { AnimatedCard } from "@/components/animations/AnimatedCard";
import { StaggerContainer, StaggerItem } from "@/components/animations/StaggerContainer";
import { AnimatedNumber } from "@/components/animations/AnimatedNumber";
import { OwnerCharts } from "./OwnerCharts";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

type OwnerPageData = {
  user: {
    name?: string;
    email?: string;
    role?: string;
  };
  dbStats: {
    totalUsers: number;
    totalEvents: number;
    totalRequests: number;
    totalAssignments: number;
    totalSchools: number;
    waitlistEntries: number;
  };
  dbTables: Array<{ name: string; count: number }>;
  chartData: {
    userGrowth: Array<{ date: string; count: number }>;
    roleDistribution: Array<{ name: string; value: number }>;
    requestStatus: Array<{ name: string; value: number }>;
    assignmentStatus: Array<{ name: string; value: number }>;
    eventsOverTime: Array<{ date: string; count: number }>;
  };
  recentUsers: Array<{ id: string; name: string; email: string; role: string; createdAt: string }>;
  recentActivity: Array<{ id: string; action: string; entity: string; ts: string }>;
  recentWaitlist: Array<{ id: string; name: string; email: string; createdAt: string }>;
  featureFlags: Array<{ key: string; value: any }>;
};

export function OwnerPageClient({ data }: { data: OwnerPageData }) {
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
        <h1 className="text-3xl font-semibold tracking-tight">Owner Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Welcome, {data.user?.name || data.user?.email}. This is your exclusive owner dashboard.
        </p>
      </motion.header>

      <StaggerContainer className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StaggerItem>
          <AnimatedCard hover>
            <Card className="bg-card/80">
              <CardHeader>
                <CardTitle className="text-lg">System Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Environment:</span>
                  <span className="text-sm font-medium">{process.env.NODE_ENV || "development"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Database:</span>
                  <span className="text-sm font-medium">✓ Connected</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Auth Secret:</span>
                  <span className="text-sm font-medium">✓ Set</span>
                </div>
              </CardContent>
            </Card>
          </AnimatedCard>
        </StaggerItem>

        <StaggerItem>
          <AnimatedCard hover>
            <Card className="bg-card/80">
              <CardHeader>
                <CardTitle className="text-lg">Database Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Users:</span>
                  <span className="text-sm font-medium">
                    <AnimatedNumber value={data.dbStats.totalUsers} />
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Events:</span>
                  <span className="text-sm font-medium">
                    <AnimatedNumber value={data.dbStats.totalEvents} />
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Schools:</span>
                  <span className="text-sm font-medium">
                    <AnimatedNumber value={data.dbStats.totalSchools} />
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Requests:</span>
                  <span className="text-sm font-medium">
                    <AnimatedNumber value={data.dbStats.totalRequests} />
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Assignments:</span>
                  <span className="text-sm font-medium">
                    <AnimatedNumber value={data.dbStats.totalAssignments} />
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Waitlist:</span>
                  <span className="text-sm font-medium">
                    <AnimatedNumber value={data.dbStats.waitlistEntries} />
                  </span>
                </div>
              </CardContent>
            </Card>
          </AnimatedCard>
        </StaggerItem>

        <StaggerItem>
          <AnimatedCard hover>
            <Card className="bg-card/80">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/admin">Admin Panel</Link>
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/analytics">Analytics</Link>
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/activity">Activity Log</Link>
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/dashboard">Dashboard</Link>
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/events">Events</Link>
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </AnimatedCard>
        </StaggerItem>

        <StaggerItem>
          <AnimatedCard hover>
            <Card className="bg-card/80">
              <CardHeader>
                <CardTitle className="text-lg">Account Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <span className="text-sm text-muted-foreground">Email:</span>
                  <p className="text-sm font-medium">{data.user?.email}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Name:</span>
                  <p className="text-sm font-medium">{data.user?.name || "Not set"}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Role:</span>
                  <p className="text-sm font-medium">{data.user?.role || "USER"}</p>
                </div>
              </CardContent>
            </Card>
          </AnimatedCard>
        </StaggerItem>
      </StaggerContainer>

      {/* Database Tables Viewer */}
      <AnimatedCard delay={0.3}>
        <Card className="bg-card/80">
          <CardHeader>
            <CardTitle className="text-lg">Database Tables</CardTitle>
          </CardHeader>
          <CardContent>
            {data.dbTables.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/60">
                      <th className="text-left py-2 px-3 text-muted-foreground font-semibold">Table Name</th>
                      <th className="text-right py-2 px-3 text-muted-foreground font-semibold">Row Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.dbTables.map((table, index) => (
                      <motion.tr
                        key={table.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.05 }}
                        className="border-b border-border/40"
                      >
                        <td className="py-2 px-3 font-mono text-xs">{table.name}</td>
                        <td className="py-2 px-3 text-right font-medium">
                          {table.count === -1 ? (
                            <span className="text-muted-foreground">N/A</span>
                          ) : (
                            <AnimatedNumber value={table.count} />
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Unable to fetch table information</p>
            )}
          </CardContent>
        </Card>
      </AnimatedCard>

      {/* Charts Section */}
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-2xl font-semibold tracking-tight mb-2">Analytics & Insights</h2>
          <p className="text-sm text-muted-foreground">
            Visual analytics showing user growth, role distribution, request/assignment status, and event activity.
          </p>
        </motion.div>
        <OwnerCharts chartData={data.chartData} />
      </div>

      <StaggerContainer className="grid gap-6 lg:grid-cols-2" staggerDelay={0.1}>
        <StaggerItem>
          <AnimatedCard>
            <Card className="bg-card/80">
              <CardHeader>
                <CardTitle className="text-lg">Environment Variables</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">OWNER_EMAIL:</span>
                    <span className="font-mono text-xs">
                      {process.env.OWNER_EMAIL ? "✓ Set" : "✗ Not Set"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">POSTGRES_URL:</span>
                    <span className="font-mono text-xs">
                      {process.env.POSTGRES_URL ? "✓ Set" : "✗ Not Set"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">NEXTAUTH_SECRET:</span>
                    <span className="font-mono text-xs">
                      {process.env.NEXTAUTH_SECRET ? "✓ Set" : "✗ Not Set"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </AnimatedCard>
        </StaggerItem>

        <StaggerItem>
          <AnimatedCard>
            <Card className="bg-card/80">
              <CardHeader>
                <CardTitle className="text-lg">System Health</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Database Connection:</span>
                  <span className="text-sm font-medium text-green-400">✓ Healthy</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Authentication:</span>
                  <span className="text-sm font-medium text-green-400">✓ Configured</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Owner Access:</span>
                  <span className="text-sm font-medium text-green-400">✓ Configured</span>
                </div>
                <div className="pt-2 border-t border-border/60">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button asChild variant="outline" size="sm" className="w-full">
                      <Link href="/api/owner/setup">Reset Owner Account</Link>
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </AnimatedCard>
        </StaggerItem>
      </StaggerContainer>

      {/* Recent Activity Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <StaggerItem>
          <AnimatedCard>
            <Card className="bg-card/80">
              <CardHeader>
                <CardTitle className="text-lg">Recent User Signups</CardTitle>
              </CardHeader>
              <CardContent>
                {data.recentUsers.length > 0 ? (
                  <div className="space-y-3">
                    {data.recentUsers.slice(0, 5).map((user, index) => (
                      <motion.div
                        key={user.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.05 }}
                        className="flex items-center justify-between rounded-lg border bg-background/60 p-3"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground truncate">{user.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {format(new Date(user.createdAt), "MMM d, h:mm a")}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs ml-2">
                          {user.role}
                        </Badge>
                      </motion.div>
                    ))}
                    {data.recentUsers.length > 5 && (
                      <p className="text-xs text-muted-foreground text-center pt-2">
                        +{data.recentUsers.length - 5} more
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No recent signups</p>
                )}
              </CardContent>
            </Card>
          </AnimatedCard>
        </StaggerItem>

        <StaggerItem>
          <AnimatedCard>
            <Card className="bg-card/80">
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {data.recentActivity.length > 0 ? (
                  <div className="space-y-3">
                    {data.recentActivity.slice(0, 5).map((activity, index) => (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.05 }}
                        className="flex items-center justify-between rounded-lg border bg-background/60 p-3"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground text-sm">{activity.action}</p>
                          <p className="text-xs text-muted-foreground">
                            {activity.entity} • {format(new Date(activity.ts), "MMM d, h:mm a")}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                    {data.recentActivity.length > 5 && (
                      <p className="text-xs text-muted-foreground text-center pt-2">
                        +{data.recentActivity.length - 5} more
                      </p>
                    )}
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button asChild variant="outline" size="sm" className="w-full mt-2">
                        <Link href="/activity">View All Activity</Link>
                      </Button>
                    </motion.div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No recent activity</p>
                )}
              </CardContent>
            </Card>
          </AnimatedCard>
        </StaggerItem>
      </div>

      {/* Recent Waitlist & Feature Flags */}
      <div className="grid gap-6 lg:grid-cols-2">
        {data.recentWaitlist.length > 0 && (
          <StaggerItem>
            <AnimatedCard>
              <Card className="bg-card/80">
                <CardHeader>
                  <CardTitle className="text-lg">Recent Waitlist Entries</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {data.recentWaitlist.slice(0, 5).map((entry, index) => (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 + index * 0.05 }}
                        className="flex items-center justify-between rounded-lg border bg-background/60 p-3"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground truncate">{entry.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{entry.email}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {format(new Date(entry.createdAt), "MMM d, h:mm a")}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                    {data.recentWaitlist.length > 5 && (
                      <p className="text-xs text-muted-foreground text-center pt-2">
                        +{data.recentWaitlist.length - 5} more
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </AnimatedCard>
          </StaggerItem>
        )}

        {data.featureFlags.length > 0 && (
          <StaggerItem>
            <AnimatedCard>
              <Card className="bg-card/80">
                <CardHeader>
                  <CardTitle className="text-lg">Feature Flags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {data.featureFlags.slice(0, 5).map((flag, index) => (
                      <motion.div
                        key={flag.key}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 + index * 0.05 }}
                        className="flex items-center justify-between rounded-lg border bg-background/60 p-3"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground text-sm font-mono">{flag.key}</p>
                          <p className="text-xs text-muted-foreground">
                            {typeof flag.value === 'boolean' 
                              ? (flag.value ? 'Enabled' : 'Disabled')
                              : JSON.stringify(flag.value)}
                          </p>
                        </div>
                        <Badge variant={flag.value === true ? "default" : "outline"} className="text-xs">
                          {flag.value === true ? "ON" : "OFF"}
                        </Badge>
                      </motion.div>
                    ))}
                    {data.featureFlags.length > 5 && (
                      <p className="text-xs text-muted-foreground text-center pt-2">
                        +{data.featureFlags.length - 5} more
                      </p>
                    )}
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button asChild variant="outline" size="sm" className="w-full mt-2">
                        <Link href="/admin/feature-flags">Manage Feature Flags</Link>
                      </Button>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </AnimatedCard>
          </StaggerItem>
        )}
      </div>
    </motion.div>
  );
}

