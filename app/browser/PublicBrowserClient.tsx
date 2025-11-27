"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Search, Calendar, School, Trophy, MapPin, Clock } from "lucide-react";
import Link from "next/link";

type League = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
};

type School = {
  id: string;
  name: string;
  slug: string;
  leagueId?: string | null;
};

type Event = {
  id: string;
  name: string;
  startsAt: string;
  endsAt?: string | null;
  schoolId: string | null;
  leagueId?: string | null;
};

type PublicBrowserClientProps = {
  initialLeagues: League[];
  initialSchools: School[];
  initialEvents: Event[];
};

export function PublicBrowserClient({
  initialLeagues,
  initialSchools,
  initialEvents,
}: PublicBrowserClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"leagues" | "schools" | "schedules" | "standings">("leagues");

  // Filter leagues
  const filteredLeagues = useMemo(() => {
    if (!searchTerm.trim()) return initialLeagues;
    const term = searchTerm.toLowerCase();
    return initialLeagues.filter(
      (league) =>
        league.name.toLowerCase().includes(term) ||
        league.description?.toLowerCase().includes(term) ||
        league.slug.toLowerCase().includes(term)
    );
  }, [initialLeagues, searchTerm]);

  // Filter schools
  const filteredSchools = useMemo(() => {
    if (!searchTerm.trim()) return initialSchools;
    const term = searchTerm.toLowerCase();
    return initialSchools.filter(
      (school) =>
        school.name.toLowerCase().includes(term) ||
        school.slug.toLowerCase().includes(term)
    );
  }, [initialSchools, searchTerm]);

  // Filter events
  const filteredEvents = useMemo(() => {
    let events = initialEvents;
    
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      events = events.filter(
        (event) =>
          event.name.toLowerCase().includes(term)
      );
    }

    // Sort by date (upcoming first)
    return events
      .filter((e) => {
        const eventDate = new Date(e.startsAt);
        return eventDate >= new Date(); // Only show future events
      })
      .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime())
      .slice(0, 50); // Limit to 50 most recent upcoming events
  }, [initialEvents, searchTerm]);

  const leagueMap = useMemo(() => {
    const map = new Map<string, League>();
    initialLeagues.forEach((league) => map.set(league.id, league));
    return map;
  }, [initialLeagues]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-border/60 bg-card/50 backdrop-blur-sm sticky top-0 z-10"
      >
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Public Browser
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Search leagues, schools, and view schedules
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 py-8">
        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search leagues, schools, or events..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 text-base"
            />
          </div>
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v: string) => setActiveTab(v as "leagues" | "schools" | "schedules" | "standings")} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="leagues" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Leagues
            </TabsTrigger>
            <TabsTrigger value="schools" className="flex items-center gap-2">
              <School className="h-4 w-4" />
              Schools
            </TabsTrigger>
            <TabsTrigger value="schedules" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Schedules
            </TabsTrigger>
            <TabsTrigger value="standings" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Standings
            </TabsTrigger>
          </TabsList>

          {/* Leagues Tab */}
          <TabsContent value="leagues" className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {filteredLeagues.length} league{filteredLeagues.length !== 1 ? "s" : ""} found
              </p>
            </div>
            {filteredLeagues.length === 0 ? (
              <Card className="bg-card/80">
                <CardContent className="py-10 text-center text-sm text-muted-foreground">
                  No leagues found. Try adjusting your search.
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredLeagues.map((league, index) => (
                  <motion.div
                    key={league.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="bg-card/80 hover:bg-card transition-colors">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Trophy className="h-5 w-5 text-[hsl(var(--accent))]" />
                          {league.name}
                        </CardTitle>
                        <Badge variant="outline" className="w-fit text-xs">
                          {league.slug}
                        </Badge>
                      </CardHeader>
                      <CardContent>
                        {league.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {league.description}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Schools Tab */}
          <TabsContent value="schools" className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {filteredSchools.length} school{filteredSchools.length !== 1 ? "s" : ""} found
              </p>
            </div>
            {filteredSchools.length === 0 ? (
              <Card className="bg-card/80">
                <CardContent className="py-10 text-center text-sm text-muted-foreground">
                  No schools found. Try adjusting your search.
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredSchools.map((school, index) => {
                  const league = school.leagueId ? leagueMap.get(school.leagueId) : null;
                  return (
                    <motion.div
                      key={school.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="bg-card/80 hover:bg-card transition-colors">
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <School className="h-5 w-5 text-[hsl(var(--accent))]" />
                            {school.name}
                          </CardTitle>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="outline" className="text-xs">
                              {school.slug}
                            </Badge>
                            {league && (
                              <Badge variant="secondary" className="text-xs">
                                {league.name}
                              </Badge>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>View schedule</span>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Schedules Tab */}
          <TabsContent value="schedules" className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {filteredEvents.length} upcoming event{filteredEvents.length !== 1 ? "s" : ""}
              </p>
            </div>
            {filteredEvents.length === 0 ? (
              <Card className="bg-card/80">
                <CardContent className="py-10 text-center text-sm text-muted-foreground">
                  No upcoming events found. Check back later for new schedules.
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {filteredEvents.map((event, index) => {
                  const league = event.leagueId ? leagueMap.get(event.leagueId) : null;
                  return (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                    >
                      <Card className="bg-card/80 hover:bg-card transition-colors">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-foreground">{event.name}</h3>
                                {league && (
                                  <Badge variant="outline" className="text-xs">
                                    {league.name}
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  {format(new Date(event.startsAt), "MMM d, yyyy")}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {format(new Date(event.startsAt), "h:mm a")}
                                  {event.endsAt && ` - ${format(new Date(event.endsAt), "h:mm a")}`}
                                </div>
                              </div>
                            </div>
                            <Button asChild variant="outline" size="sm">
                              <Link href={`/events/${event.id}`}>View Details</Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Standings Tab (Placeholder) */}
          <TabsContent value="standings" className="space-y-4">
            <Card className="bg-card/80">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-[hsl(var(--accent))]" />
                  Standings
                </CardTitle>
              </CardHeader>
              <CardContent className="py-10 text-center">
                <p className="text-muted-foreground mb-4">
                  Standings feature coming soon!
                </p>
                <p className="text-sm text-muted-foreground">
                  We're working on adding league standings, team records, and statistics.
                  Check back soon for updates.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

