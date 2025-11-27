"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

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

type SportSpecificViewProps = {
  sport: Sport;
  data: SportData;
};

// Sport-specific field configurations
const sportFields: Record<Sport, Array<{ label: string; key: string; format?: (value: any) => string }>> = {
  volleyball: [
    { label: "Sets Won", key: "setsWon" },
    { label: "Sets Lost", key: "setsLost" },
    { label: "Aces", key: "aces" },
    { label: "Blocks", key: "blocks" },
  ],
  basketball: [
    { label: "Points Per Game", key: "ppg", format: (v) => `${v?.toFixed(1) || 0} PPG` },
    { label: "Rebounds", key: "rebounds" },
    { label: "Assists", key: "assists" },
    { label: "3-Point %", key: "threePointPct", format: (v) => `${(v * 100)?.toFixed(1) || 0}%` },
  ],
  football: [
    { label: "Touchdowns", key: "touchdowns" },
    { label: "Yards Gained", key: "yards" },
    { label: "Interceptions", key: "interceptions" },
    { label: "Sacks", key: "sacks" },
  ],
  soccer: [
    { label: "Goals Scored", key: "goals" },
    { label: "Assists", key: "assists" },
    { label: "Shots on Goal", key: "shotsOnGoal" },
    { label: "Saves", key: "saves" },
  ],
  baseball: [
    { label: "Batting Average", key: "battingAvg", format: (v) => v?.toFixed(3) || "0.000" },
    { label: "Home Runs", key: "homeRuns" },
    { label: "RBIs", key: "rbis" },
    { label: "ERA", key: "era", format: (v) => v?.toFixed(2) || "0.00" },
  ],
  softball: [
    { label: "Batting Average", key: "battingAvg", format: (v) => v?.toFixed(3) || "0.000" },
    { label: "Home Runs", key: "homeRuns" },
    { label: "RBIs", key: "rbis" },
    { label: "ERA", key: "era", format: (v) => v?.toFixed(2) || "0.00" },
  ],
  track: [
    { label: "Personal Best", key: "personalBest" },
    { label: "Season Best", key: "seasonBest" },
    { label: "Qualifying Times", key: "qualifyingTimes" },
    { label: "Events", key: "events" },
  ],
};

export function SportSpecificView({ sport, data }: SportSpecificViewProps) {
  const fields = sportFields[sport] || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <Card className="bg-card/80">
        <CardHeader>
          <CardTitle className="text-lg">Sport-Specific Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {fields.map((field) => (
              <div key={field.key} className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  {field.label}
                </p>
                <p className="text-lg font-semibold">
                  {field.format
                    ? field.format(null) // In a real app, this would come from team/player data
                    : "—"}
                </p>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Custom fields for {sport} will be displayed here. Connect team statistics to see real data.
          </p>
        </CardContent>
      </Card>

      {/* Sport-specific information */}
      {sport === "volleyball" && (
        <Card className="bg-card/80">
          <CardHeader>
            <CardTitle className="text-lg">Volleyball Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Track sets, aces, blocks, and other volleyball-specific statistics.
            </p>
          </CardContent>
        </Card>
      )}

      {sport === "basketball" && (
        <Card className="bg-card/80">
          <CardHeader>
            <CardTitle className="text-lg">Basketball Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Monitor points per game, rebounds, assists, and shooting percentages.
            </p>
          </CardContent>
        </Card>
      )}

      {sport === "football" && (
        <Card className="bg-card/80">
          <CardHeader>
            <CardTitle className="text-lg">Football Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Track touchdowns, yards, interceptions, and defensive statistics.
            </p>
          </CardContent>
        </Card>
      )}

      {sport === "soccer" && (
        <Card className="bg-card/80">
          <CardHeader>
            <CardTitle className="text-lg">Soccer Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Monitor goals, assists, shots on goal, and goalkeeper saves.
            </p>
          </CardContent>
        </Card>
      )}

      {(sport === "baseball" || sport === "softball") && (
        <Card className="bg-card/80">
          <CardHeader>
            <CardTitle className="text-lg">{sport === "baseball" ? "Baseball" : "Softball"} Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Track batting averages, home runs, RBIs, and pitching statistics (ERA).
            </p>
          </CardContent>
        </Card>
      )}

      {sport === "track" && (
        <Card className="bg-card/80">
          <CardHeader>
            <CardTitle className="text-lg">Track & Field Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Monitor personal bests, season bests, qualifying times, and event participation.
            </p>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}

