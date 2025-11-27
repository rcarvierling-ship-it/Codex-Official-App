"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { motion } from "framer-motion";
import { Trophy, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export type TeamStanding = {
  teamId: string;
  teamName: string;
  wins: number;
  losses: number;
  ties: number;
  pointsFor: number;
  pointsAgainst: number;
  winPercentage: number;
  rank: number;
};

type StandingsTableProps = {
  standings: TeamStanding[];
  divisionName?: string;
  showRankChange?: boolean; // For future: show rank change from previous period
};

export function StandingsTable({
  standings,
  divisionName,
  showRankChange = false,
}: StandingsTableProps) {
  if (standings.length === 0) {
    return (
      <Card className="bg-card/80">
        <CardHeader>
          <CardTitle>{divisionName || "Standings"}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            No standings data available yet. Game results will appear here once games are completed.
          </p>
        </CardContent>
      </Card>
    );
  }

  const formatPercentage = (value: number): string => {
    return (value * 100).toFixed(1);
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) {
      return <Trophy className="h-4 w-4 text-yellow-500" />;
    }
    return null;
  };

  const getPointDifferential = (pointsFor: number, pointsAgainst: number): number => {
    return pointsFor - pointsAgainst;
  };

  return (
    <Card className="bg-card/80">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {divisionName || "Standings"}
          {standings.length > 0 && (
            <Badge variant="outline" className="text-xs">
              {standings.length} Teams
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12 text-center">Rank</TableHead>
                <TableHead>Team</TableHead>
                <TableHead className="text-center">W</TableHead>
                <TableHead className="text-center">L</TableHead>
                <TableHead className="text-center">T</TableHead>
                <TableHead className="text-center">W-L %</TableHead>
                <TableHead className="text-center">PF</TableHead>
                <TableHead className="text-center">PA</TableHead>
                <TableHead className="text-center">Diff</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {standings.map((standing, index) => {
                const pointDiff = getPointDifferential(standing.pointsFor, standing.pointsAgainst);
                const isTopThree = standing.rank <= 3;
                
                return (
                  <motion.tr
                    key={standing.teamId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                      "border-b border-border/40",
                      isTopThree && "bg-accent/30"
                    )}
                  >
                    <TableCell className="text-center font-semibold">
                      <div className="flex items-center justify-center gap-1">
                        {getRankIcon(standing.rank)}
                        <span className={cn(
                          standing.rank === 1 && "text-yellow-500",
                          standing.rank === 2 && "text-gray-400",
                          standing.rank === 3 && "text-amber-600"
                        )}>
                          {standing.rank}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{standing.teamName}</TableCell>
                    <TableCell className="text-center text-emerald-600 dark:text-emerald-400 font-semibold">
                      {standing.wins}
                    </TableCell>
                    <TableCell className="text-center text-red-600 dark:text-red-400 font-semibold">
                      {standing.losses}
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground">
                      {standing.ties}
                    </TableCell>
                    <TableCell className="text-center font-semibold">
                      {formatPercentage(standing.winPercentage)}%
                    </TableCell>
                    <TableCell className="text-center">{standing.pointsFor}</TableCell>
                    <TableCell className="text-center">{standing.pointsAgainst}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        {pointDiff > 0 ? (
                          <TrendingUp className="h-3 w-3 text-emerald-500" />
                        ) : pointDiff < 0 ? (
                          <TrendingDown className="h-3 w-3 text-red-500" />
                        ) : (
                          <Minus className="h-3 w-3 text-muted-foreground" />
                        )}
                        <span className={cn(
                          pointDiff > 0 && "text-emerald-600 dark:text-emerald-400",
                          pointDiff < 0 && "text-red-600 dark:text-red-400"
                        )}>
                          {pointDiff > 0 ? `+${pointDiff}` : pointDiff}
                        </span>
                      </div>
                    </TableCell>
                  </motion.tr>
                );
              })}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4 text-xs text-muted-foreground">
          <p>W = Wins, L = Losses, T = Ties, W-L % = Win-Loss Percentage</p>
          <p>PF = Points For, PA = Points Against, Diff = Point Differential</p>
        </div>
      </CardContent>
    </Card>
  );
}

