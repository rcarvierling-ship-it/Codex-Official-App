"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  Circle,
  Square,
  Hexagon,
  Triangle,
  Pentagon,
  Octagon,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SportSpecificView } from "./SportSpecificView";

type Sport = "volleyball" | "basketball" | "football" | "soccer" | "baseball" | "softball" | "track";

type SportData = {
  sport: Sport;
  teams: Array<{
    id: string;
    name: string;
    level: string | null;
    record?: string;
    nextGame?: string;
  }>;
  events: Array<{
    id: string;
    name: string;
    startsAt: string;
    status: string;
  }>;
  stats: {
    totalTeams: number;
    upcomingGames: number;
    completedGames: number;
    winLossRecord?: string;
  };
};

type MultiSportDashboardProps = {
  sportsData: Record<Sport, SportData>;
};

const sportConfig: Record<Sport, { label: string; icon: React.ComponentType<{ className?: string }>; color: string }> = {
  volleyball: {
    label: "Volleyball",
    icon: Circle,
    color: "bg-orange-500/20 text-orange-300 border-orange-500/40",
  },
  basketball: {
    label: "Basketball",
    icon: Square,
    color: "bg-orange-500/20 text-orange-300 border-orange-500/40",
  },
  football: {
    label: "Football",
    icon: Hexagon,
    color: "bg-blue-500/20 text-blue-300 border-blue-500/40",
  },
  soccer: {
    label: "Soccer",
    icon: Circle,
    color: "bg-green-500/20 text-green-300 border-green-500/40",
  },
  baseball: {
    label: "Baseball",
    icon: Triangle,
    color: "bg-blue-500/20 text-blue-300 border-blue-500/40",
  },
  softball: {
    label: "Softball",
    icon: Pentagon,
    color: "bg-pink-500/20 text-pink-300 border-pink-500/40",
  },
  track: {
    label: "Track & Field",
    icon: Activity,
    color: "bg-purple-500/20 text-purple-300 border-purple-500/40",
  },
};

export function MultiSportDashboard({ sportsData }: MultiSportDashboardProps) {
  const [selectedSport, setSelectedSport] = useState<Sport>("basketball");

  const availableSports = Object.keys(sportsData).filter(
    (sport) => sportsData[sport as Sport]?.teams.length > 0 || sportsData[sport as Sport]?.events.length > 0
  ) as Sport[];

  const currentSportData = sportsData[selectedSport];
  const sportInfo = sportConfig[selectedSport];

  if (availableSports.length === 0) {
    return (
      <Card className="bg-card/80">
        <CardContent className="py-10 text-center text-sm text-muted-foreground">
          No sports data available. Add teams and events to get started.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Sport Tabs */}
      <Tabs value={selectedSport} onValueChange={(value: string) => setSelectedSport(value as Sport)}>
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7 gap-2 h-auto">
          {Object.entries(sportConfig).map(([sport, config]) => {
            const Icon = config.icon;
            const hasData = availableSports.includes(sport as Sport);
            return (
              <TabsTrigger
                key={sport}
                value={sport}
                disabled={!hasData}
                className={cn(
                  "flex flex-col items-center gap-2 p-3 data-[state=active]:bg-[hsl(var(--accent))]/10",
                  !hasData && "opacity-50"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs">{config.label}</span>
                {hasData && (
                  <Badge variant="outline" className="text-xs">
                    {sportsData[sport as Sport]?.teams.length || 0}
                  </Badge>
                )}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {/* Sport-Specific Content */}
        {availableSports.map((sport) => (
          <TabsContent key={sport} value={sport} className="space-y-6 mt-6">
            <SportView sport={sport} data={sportsData[sport]} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

type SportViewProps = {
  sport: Sport;
  data: SportData;
};

function SportView({ sport, data }: SportViewProps) {
  const config = sportConfig[sport];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Sport Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {config.icon && <config.icon className="h-8 w-8 text-[hsl(var(--accent))]" />}
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">{config.label}</h2>
            <p className="text-sm text-muted-foreground">
              {data.teams.length} teams • {data.events.length} events
            </p>
          </div>
        </div>
        <Badge className={config.color}>
          {data.stats.totalTeams} Teams
        </Badge>
      </div>

      {/* Sport-Specific Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-card/80">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground">Upcoming Games</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{data.stats.upcomingGames}</div>
          </CardContent>
        </Card>
        <Card className="bg-card/80">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{data.stats.completedGames}</div>
          </CardContent>
        </Card>
        {data.stats.winLossRecord && (
          <Card className="bg-card/80">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground">Record</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{data.stats.winLossRecord}</div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Sport-Specific Content */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Teams */}
        <Card className="bg-card/80">
          <CardHeader>
            <CardTitle className="text-lg">{config.label} Teams</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.teams.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No teams for this sport yet.
              </p>
            ) : (
              data.teams.map((team) => (
                <motion.div
                  key={team.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-3 rounded-lg border bg-background/60"
                >
                  <div>
                    <p className="font-medium">{team.name}</p>
                    {team.level && (
                      <p className="text-xs text-muted-foreground">{team.level}</p>
                    )}
                    {team.record && (
                      <p className="text-xs text-muted-foreground mt-1">Record: {team.record}</p>
                    )}
                  </div>
                  {team.nextGame && (
                    <Badge variant="outline" className="text-xs">
                      Next: {new Date(team.nextGame).toLocaleDateString()}
                    </Badge>
                  )}
                </motion.div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card className="bg-card/80">
          <CardHeader>
            <CardTitle className="text-lg">Upcoming {config.label} Events</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.events.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No upcoming events for this sport.
              </p>
            ) : (
              data.events.slice(0, 10).map((event) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-3 rounded-lg border bg-background/60"
                >
                  <div>
                    <p className="font-medium">{event.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(event.startsAt).toLocaleDateString()} at{" "}
                      {new Date(event.startsAt).toLocaleTimeString([], {
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <Badge
                    variant={event.status === "SCHEDULED" ? "outline" : "default"}
                    className="text-xs"
                  >
                    {event.status}
                  </Badge>
                </motion.div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Sport-Specific View */}
      <SportSpecificView sport={sport} data={data} />
    </motion.div>
  );
}

