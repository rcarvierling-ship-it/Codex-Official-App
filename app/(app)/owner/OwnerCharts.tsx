"use client";

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { AnimatedCard } from "@/components/animations/AnimatedCard";
import { StaggerContainer, StaggerItem } from "@/components/animations/StaggerContainer";

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00', '#0088fe', '#ff00ff'];

type ChartData = {
  userGrowth: Array<{ date: string; count: number }>;
  roleDistribution: Array<{ name: string; value: number }>;
  requestStatus: Array<{ name: string; value: number }>;
  assignmentStatus: Array<{ name: string; value: number }>;
  eventsOverTime: Array<{ date: string; count: number }>;
};

export function OwnerCharts({ chartData }: { chartData: ChartData }) {
  return (
    <StaggerContainer className="grid gap-6 lg:grid-cols-2" staggerDelay={0.1}>
      {/* User Growth Chart */}
      <StaggerItem>
        <AnimatedCard>
          <Card className="bg-card/80">
        <CardHeader>
          <CardTitle className="text-lg">User Growth (Last 30 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          {chartData.userGrowth.length > 0 ? (
        // @ts-expect-error - ChartContainer accepts children but types aren't properly exported
        <ChartContainer
          config={{
            count: {
              label: "Users",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-[300px]"
        >
          <LineChart data={chartData.userGrowth}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="date" 
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line 
              type="monotone" 
              dataKey="count" 
              stroke="hsl(var(--chart-1))" 
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ChartContainer>
      ) : (
        <div className="flex items-center justify-center h-[300px] text-sm text-muted-foreground">
          No data available
        </div>
      )}

      {/* Role Distribution Chart */}
      {chartData.roleDistribution.length > 0 ? (
        // @ts-expect-error - ChartContainer accepts children but types aren't properly exported
        <ChartContainer
          config={chartData.roleDistribution.reduce((acc, item, idx) => {
            acc[item.name] = {
              label: item.name,
              color: COLORS[idx % COLORS.length],
            };
            return acc;
          }, {} as Record<string, { label: string; color: string }>)}
          className="h-[300px]"
        >
          <PieChart>
            <Pie
              data={chartData.roleDistribution}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.roleDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <ChartTooltip content={<ChartTooltipContent />} />
          </PieChart>
        </ChartContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-sm text-muted-foreground">
              No data available
            </div>
          )}
          </CardContent>
        </Card>
      </AnimatedCard>
      </StaggerItem>

      {/* Request Status Chart */}
      <StaggerItem>
        <AnimatedCard>
          <Card className="bg-card/80">
        <CardHeader>
          <CardTitle className="text-lg">Request Status Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          {chartData.requestStatus.length > 0 ? (
        // @ts-expect-error - ChartContainer accepts children but types aren't properly exported
        <ChartContainer
          config={chartData.requestStatus.reduce((acc, item, idx) => {
            acc[item.name] = {
              label: item.name,
              color: COLORS[idx % COLORS.length],
            };
            return acc;
          }, {} as Record<string, { label: string; color: string }>)}
          className="h-[300px]"
        >
          <BarChart data={chartData.requestStatus}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="name" 
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            />
            <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="value" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-sm text-muted-foreground">
              No data available
            </div>
          )}
          </CardContent>
        </Card>
      </AnimatedCard>
      </StaggerItem>

      {/* Assignment Status Chart */}
      <StaggerItem>
        <AnimatedCard>
          <Card className="bg-card/80">
        <CardHeader>
          <CardTitle className="text-lg">Assignment Status Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          {chartData.assignmentStatus.length > 0 ? (
        // @ts-expect-error - ChartContainer accepts children but types aren't properly exported
        <ChartContainer
          config={chartData.assignmentStatus.reduce((acc, item, idx) => {
            acc[item.name] = {
              label: item.name,
              color: COLORS[idx % COLORS.length],
            };
            return acc;
          }, {} as Record<string, { label: string; color: string }>)}
          className="h-[300px]"
        >
          <BarChart data={chartData.assignmentStatus}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="name" 
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            />
            <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="value" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-sm text-muted-foreground">
              No data available
            </div>
          )}
          </CardContent>
        </Card>
      </AnimatedCard>
      </StaggerItem>

      {/* Events Over Time Chart */}
      <StaggerItem className="lg:col-span-2">
        <AnimatedCard>
          <Card className="bg-card/80">
        <CardHeader>
          <CardTitle className="text-lg">Events Created (Last 30 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          {chartData.eventsOverTime.length > 0 ? (
          // @ts-expect-error - ChartContainer accepts children but types aren't properly exported
          <ChartContainer
            config={{
              count: {
                label: "Events",
                color: "hsl(var(--chart-3))",
              },
            }}
            className="h-[300px]"
          >
            <BarChart data={chartData.eventsOverTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="date" 
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="count" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-sm text-muted-foreground">
              No data available
            </div>
          )}
          </CardContent>
        </Card>
      </AnimatedCard>
      </StaggerItem>
    </StaggerContainer>
  );
}

