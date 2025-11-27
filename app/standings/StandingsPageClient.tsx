"use client";

import { useState } from "react";
import { StandingsTable, type TeamStanding } from "@/components/standings/StandingsTable";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Trophy, TrendingUp } from "lucide-react";

type League = {
  id: string;
  name: string;
  slug: string;
};

type Division = {
  leagueId: string;
  leagueName: string;
  sport: string;
  level: string;
  standings: TeamStanding[];
};

type StandingsPageClientProps = {
  leagues: League[];
  divisions: Division[];
};

export function StandingsPageClient({ leagues, divisions }: StandingsPageClientProps) {
  const [selectedLeague, setSelectedLeague] = useState<string>("all");
  const [selectedSport, setSelectedSport] = useState<string>("all");

  // Filter divisions based on selections
  const filteredDivisions = divisions.filter((division) => {
    if (selectedLeague !== "all" && division.leagueId !== selectedLeague) {
      return false;
    }
    if (selectedSport !== "all" && division.sport !== selectedSport) {
      return false;
    }
    return true;
  });

  // Get unique sports
  const sports = Array.from(new Set(divisions.map((d) => d.sport))).sort();

  // Group divisions by league
  const divisionsByLeague = filteredDivisions.reduce((acc, division) => {
    if (!acc[division.leagueId]) {
      acc[division.leagueId] = [];
    }
    acc[division.leagueId].push(division);
    return acc;
  }, {} as Record<string, Division[]>);

  return (
    <div className="space-y-6">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-3xl font-semibold tracking-tight">Standings & Leaderboards</h1>
        <p className="text-sm text-muted-foreground">
          View current standings, wins, losses, and statistics for all divisions and teams.
        </p>
      </motion.header>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap gap-4"
      >
        <Select value={selectedLeague} onValueChange={setSelectedLeague}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Leagues" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Leagues</SelectItem>
            {leagues.map((league) => (
              <SelectItem key={league.id} value={league.id}>
                {league.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedSport} onValueChange={setSelectedSport}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Sports" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sports</SelectItem>
            {sports.map((sport) => (
              <SelectItem key={sport} value={sport}>
                {sport}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </motion.div>

      {/* Standings by League */}
      {Object.keys(divisionsByLeague).length === 0 ? (
        <Card className="bg-card/80">
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            No standings data available. Game results will appear here once games are completed.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {Object.entries(divisionsByLeague).map(([leagueId, leagueDivisions], leagueIndex) => {
            const leagueName = leagueDivisions[0]?.leagueName || "Unknown League";
            
            return (
              <motion.div
                key={leagueId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + leagueIndex * 0.1 }}
                className="space-y-4"
              >
                <h2 className="text-2xl font-semibold tracking-tight">{leagueName}</h2>
                
                {leagueDivisions.length === 1 ? (
                  <StandingsTable
                    standings={leagueDivisions[0].standings}
                    divisionName={`${leagueDivisions[0].sport} - ${leagueDivisions[0].level}`}
                  />
                ) : (
                  <Tabs defaultValue={leagueDivisions[0]?.sport + "-" + leagueDivisions[0]?.level} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 lg:grid-cols-3">
                      {leagueDivisions.map((division) => (
                        <TabsTrigger
                          key={`${division.sport}-${division.level}`}
                          value={`${division.sport}-${division.level}`}
                        >
                          {division.sport} - {division.level}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    {leagueDivisions.map((division) => (
                      <TabsContent
                        key={`${division.sport}-${division.level}`}
                        value={`${division.sport}-${division.level}`}
                      >
                        <StandingsTable
                          standings={division.standings}
                          divisionName={`${division.sport} - ${division.level}`}
                        />
                      </TabsContent>
                    ))}
                  </Tabs>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

