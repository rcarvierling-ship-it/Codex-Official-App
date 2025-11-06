'use client';
export const dynamic = 'force-dynamic';

import { format, addDays, isWithinInterval } from "date-fns";
import Link from "next/link";
import { useMemo, useState, useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import {
  personaOptions,
  useDemoStore,
} from "./_state/demoStore";
export default function DemoOverviewPage() {
  const { toast } = useToast();
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsRoleDropdownOpen(false);
      }
    };
    if (isRoleDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isRoleDropdownOpen]);
  
  const events = useDemoStore((state) => state.events) ?? [];
  const requests = useDemoStore((state) => state.requests) ?? [];
  const assignments = useDemoStore((state) => state.assignments) ?? [];
  const activity = useDemoStore((state) => state.activity) ?? [];
  const users = useDemoStore((state) => state.users) ?? [];
  const leagues = useDemoStore((state) => state.leagues) ?? [];
  const schools = useDemoStore((state) => state.schools) ?? [];
  const teams = useDemoStore((state) => state.teams) ?? [];
  const venues = useDemoStore((state) => state.venues) ?? [];
  const currentPersona = useDemoStore((state) => state.currentPersona);
  const currentRole = useDemoStore((state) => state.currentRole);
  const setPersona = useDemoStore((state) => state.setPersona);
  const approveRequest = useDemoStore((state) => state.approveRequest);
  const declineRequest = useDemoStore((state) => state.declineRequest);

  const personaMeta = personaOptions.find(p => p.label === currentPersona);

  const handleSetPersona = (personaLabel: string) => {
    setPersona(personaLabel);
    setIsRoleDropdownOpen(false);
  };

  const pendingRequests = useMemo(
    () => (requests ?? []).filter((r) => r.status === "PENDING").slice(0, 4),
    [requests]
  );

  const upcomingEvents = useMemo(() => {
    const now = new Date();
    return [...(events ?? [])]
      .filter((e) => isWithinInterval(new Date(e.start), { start: now, end: addDays(now, 30) }))
      .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
      .slice(0, 6);
  }, [events]);

  const recentActivity = (activity ?? []).slice(0, 3);

  const canApprove = ["SUPER_ADMIN", "ADMIN", "AD"].includes(currentRole);
  
  const handleApproveRequest = (id: string) => {
    if (!canApprove) {
      toast({ title: "Requires AD access", description: "Switch to a School Admin or Athletic Director persona to approve." });
      return;
    }
    approveRequest(id);
    toast({ title: "Request approved", description: "Event now has confirmed coverage." });
  };

  const handleDeclineRequest = (id: string) => {
    if (!canApprove) {
      toast({ title: "Requires AD access", description: "Switch to a School Admin or Athletic Director persona to decline." });
      return;
    }
    declineRequest(id);
    toast({ title: "Request declined", description: "The requester was notified immediately." });
  };

  return (
    <div className="min-h-screen bg-background p-6 space-y-8">
      {/* Role Selector */}
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <span>Select Role to Explore</span>
        </h1>
        <p className="text-sm text-muted-foreground">
          Switch between different user perspectives to see role-specific features
        </p>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
            className="w-full rounded-lg border-2 border-emerald-500/50 bg-card px-4 py-3 text-left flex items-center justify-between hover:border-emerald-500 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-foreground font-medium">{currentPersona}</span>
              <span className="text-muted-foreground">— {personaMeta?.summary}</span>
            </div>
            <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {isRoleDropdownOpen && (
            <div className="absolute z-50 w-full mt-2 rounded-lg border bg-card shadow-lg">
              {personaOptions.map((persona) => (
                <button
                  key={persona.label}
                  onClick={() => handleSetPersona(persona.label)}
                  className="w-full px-4 py-3 text-left hover:bg-muted flex items-center justify-between"
                >
                  <div>
                    <div className="font-medium text-foreground">{persona.label}</div>
                    <div className="text-sm text-muted-foreground">{persona.summary}</div>
                  </div>
                  {currentPersona === persona.label && (
                    <span className="text-emerald-500">✓</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Role-Specific Content */}
      {currentPersona === 'School Admin' && (
        <SchoolAdminDashboard
          teams={teams}
          schools={schools}
          pendingRequests={pendingRequests}
          upcomingEvents={upcomingEvents}
          recentActivity={recentActivity}
          users={users}
          approveRequest={handleApproveRequest}
          declineRequest={handleDeclineRequest}
          canApprove={canApprove}
        />
      )}

      {currentPersona === 'League Admin' && (
        <LeagueAdminDashboard
          leagues={leagues}
          events={upcomingEvents}
          assignments={assignments}
          recentActivity={recentActivity}
          users={users}
        />
      )}

      {currentPersona === 'Coach' && (
        <CoachDashboard
          events={upcomingEvents}
          teams={teams}
          requests={requests}
          recentActivity={recentActivity}
          users={users}
        />
      )}

      {currentPersona === 'Athletic Director' && (
        <AthleticDirectorDashboard
          events={upcomingEvents}
          requests={pendingRequests}
          teams={teams}
          assignments={assignments}
          recentActivity={recentActivity}
          approveRequest={handleApproveRequest}
          declineRequest={handleDeclineRequest}
          canApprove={canApprove}
        />
      )}

      {currentPersona === 'Official' && (
        <OfficialDashboard
          events={upcomingEvents}
          assignments={assignments}
          recentActivity={recentActivity}
        />
      )}

      {/* Waitlist Feature - Always visible */}
      <Card className="flex items-center justify-between bg-card/80 px-6 py-8 border-emerald-500/30">
        <div>
          <h3 className="text-xl font-semibold text-foreground">Ready to get started?</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Join the waitlist to be among the first to deploy The Official App.
          </p>
        </div>
        <Button
          asChild
          className="bg-emerald-500 hover:bg-emerald-600 text-white"
        >
          <Link href="/#waitlist">Join the Waitlist</Link>
        </Button>
      </Card>
    </div>
  );
}

// School Admin Dashboard
function SchoolAdminDashboard({
  teams,
  schools,
  pendingRequests,
  upcomingEvents,
  recentActivity,
  users,
  approveRequest,
  declineRequest,
  canApprove,
}: any) {
  const officials = (users ?? []).filter((u: any) => u.role === 'OFFICIAL');
  return (
    <>
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="bg-card/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>Teams Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-3xl font-semibold text-emerald-500">8</div>
              <div className="text-sm text-muted-foreground">Active Teams</div>
            </div>
            <div className="space-y-2">
              {teams.slice(0, 3).map((team: any) => (
                <div key={team.id} className="rounded-lg border bg-background/60 p-3">
                  <div className="font-medium text-foreground">{team.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {schools.find((s: any) => s.id === team.schoolId)?.mascot || 'Team'}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>Team Roster</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              { number: "#23", name: "Michael Jordan", position: "Guard • 12th" },
              { number: "#10", name: "Kobe Bryant", position: "Guard • 11th" },
              { number: "#32", name: "Magic Johnson", position: "Forward • 12th" },
              { number: "#33", name: "Larry Bird", position: "Forward • 11th" },
            ].map((player, i) => (
              <div key={i} className="rounded-lg border bg-background/60 p-3">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-emerald-500">{player.number}</span>
                  <span className="text-foreground">{player.name}</span>
                </div>
                <div className="text-xs text-muted-foreground">{player.position}</div>
              </div>
            ))}
            <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white mt-2">
              <span className="mr-2">+</span> Add Player
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-card/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>Schedule Approvals</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingRequests.slice(0, 1).map((req: any) => {
              const event = upcomingEvents.find((e: any) => e.id === req.eventId);
              return (
                <div key={req.id} className="rounded-lg border bg-background/60 p-3">
                  <div className="font-medium text-foreground">{event?.title || 'Warriors vs Eagles'}</div>
                  <div className="text-xs text-muted-foreground">Requested by Coach Smith</div>
                  <div className="flex gap-2 mt-2">
                    <Button
                      size="sm"
                      className="bg-emerald-500 hover:bg-emerald-600 text-white flex-1"
                      onClick={() => approveRequest(req.id)}
                      disabled={!canApprove}
                    >
                      ✓ Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => declineRequest(req.id)}
                      disabled={!canApprove}
                    >
                      ✕ Deny
                    </Button>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card/80">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>Officials Pool</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {officials.slice(0, 6).map((o: any) => (
              <div key={o.id} className="rounded-lg border bg-background/60 p-3">
                <div className="font-medium text-foreground">{o.name}</div>
                <div className="text-xs text-muted-foreground">{o.sports?.join(', ') || 'Multi-sport'}</div>
                <div className="mt-1 text-xs text-muted-foreground">Avail: {o.availability?.join(', ') || '—'}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card/80">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>School Analytics</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-semibold text-emerald-500">12</div>
              <div className="text-xs text-muted-foreground">Total Teams</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-emerald-500">156</div>
              <div className="text-xs text-muted-foreground">Student Athletes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-orange-500">48</div>
              <div className="text-xs text-muted-foreground">Upcoming Events</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-orange-500">3</div>
              <div className="text-xs text-muted-foreground">Pending Approvals</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <RecentActivitySection activity={recentActivity} />
    </>
  );
}

// League Admin Dashboard
function LeagueAdminDashboard({ leagues, events, assignments, recentActivity, users }: any) {
  const officials = (users ?? []).filter((u: any) => u.role === 'OFFICIAL');
  return (
    <>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-card/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>My Leagues</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {leagues.slice(0, 3).map((league: any) => (
              <div key={league.id} className="rounded-lg border bg-background/60 p-4 relative">
                <div className="font-medium text-foreground">{league.name}</div>
                <div className="text-sm text-muted-foreground">Basketball • Fall 2024 • Varsity</div>
                <div className="flex gap-2 mt-2">
                  <Badge variant="outline" className="text-xs">{league.region}</Badge>
                  <Badge className="bg-emerald-500/20 text-emerald-500 border-emerald-500/30 text-xs">Verified</Badge>
                </div>
                <div className="absolute top-3 right-3">
                  <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
            ))}
            <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white">
              + Create New League
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-card/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>Official Assignments</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {events.slice(0, 3).map((event: any) => (
              <div key={event.id} className="rounded-lg border bg-background/60 p-4">
                <div className="font-medium text-foreground">{event.title}</div>
                <div className="text-sm text-muted-foreground">
                  {format(new Date(event.start), "MMM d, yyyy")} • Needs 2 officials
                </div>
                <div className="flex gap-2 mt-2">
                  <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white">Assign Official</Button>
                  <Button size="sm" variant="outline">View Requests</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card/80">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>Officials Pool</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-3">
            {officials.slice(0, 8).map((o: any) => (
              <div key={o.id} className="rounded-lg border bg-background/60 p-3">
                <div className="font-medium text-foreground">{o.name}</div>
                <div className="text-xs text-muted-foreground">{o.sports?.join(', ') || 'Multi-sport'}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card/80">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>League Analytics</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-semibold text-emerald-500">24</div>
              <div className="text-xs text-muted-foreground">Participating Schools</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-emerald-500">89</div>
              <div className="text-xs text-muted-foreground">Total Events</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-emerald-500">142</div>
              <div className="text-xs text-muted-foreground">Officials Assigned</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-emerald-500">$18.5K</div>
              <div className="text-xs text-muted-foreground">Total Payments</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <RecentActivitySection activity={recentActivity} />
    </>
  );
}

// Coach Dashboard
function CoachDashboard({ events, teams, requests, recentActivity, users }: any) {
  const officials = (users ?? []).filter((u: any) => u.role === 'OFFICIAL');
  return (
    <>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-card/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>Team Schedule</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {events.slice(0, 5).map((event: any) => (
              <div key={event.id} className="rounded-lg border bg-background/60 p-3 flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-medium text-foreground">{event.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {format(new Date(event.start), "MMM d, yyyy 'at' h:mm a")}
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <span>📍</span>
                    <span>Central High School Gym</span>
                  </div>
                </div>
                <button className="p-2 hover:bg-muted rounded">
                  <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-card/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>Communication</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-lg border bg-background/60 p-3">
              <div className="text-xs text-muted-foreground mb-1">Message from Official</div>
              <div className="font-medium text-foreground">Re: Warriors vs Eagles game</div>
              <div className="text-sm text-muted-foreground mt-1">"Confirming I'll be there 30 min before tip-off."</div>
            </div>
            <div className="rounded-lg border bg-background/60 p-3">
              <div className="text-xs text-muted-foreground mb-1">League Announcement</div>
              <div className="font-medium text-foreground">League Admin • 2h ago</div>
              <div className="text-sm text-muted-foreground mt-1">"Playoff schedule has been updated. Please review..."</div>
            </div>
            <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white">
              <span className="mr-2">✈</span> New Message
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card/80">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>My Team Roster</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-3">
            {[
              { number: "#23", name: "Michael Jordan", position: "Guard" },
              { number: "#10", name: "Kobe Bryant", position: "Guard" },
              { number: "#34", name: "Shaquille O'Neal", position: "Center" },
              { number: "#24", name: "LeBron James", position: "Forward" },
              { number: "#32", name: "Magic Johnson", position: "Forward" },
              { number: "#30", name: "Stephen Curry", position: "Guard" },
              { number: "#33", name: "Larry Bird", position: "Forward" },
              { number: "#35", name: "Kevin Durant", position: "Forward" },
            ].map((player, i) => (
              <div key={i} className="rounded-lg border bg-background/60 p-3 text-center">
                <div className="text-2xl font-semibold text-emerald-500">{player.number}</div>
                <div className="text-sm font-medium text-foreground mt-1">{player.name}</div>
                <div className="text-xs text-muted-foreground">{player.position}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card/80">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>Officials Pool</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-3">
            {officials.slice(0, 8).map((o: any) => (
              <div key={o.id} className="rounded-lg border bg-background/60 p-3 text-center">
                <div className="font-medium text-foreground">{o.name}</div>
                <div className="text-xs text-muted-foreground">{o.sports?.[0] || 'Official'}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <RecentActivitySection activity={recentActivity} />
    </>
  );
}

// Athletic Director Dashboard
function AthleticDirectorDashboard({
  events,
  requests,
  teams,
  assignments,
  recentActivity,
  approveRequest,
  declineRequest,
  canApprove,
}: any) {
  return (
    <>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-card/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>Event Approvals</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {events.slice(0, 4).map((event: any) => (
              <div key={event.id} className="rounded-lg border bg-background/60 p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-foreground">{event.title}</div>
                  <Badge className="bg-emerald-500/20 text-emerald-500 border-emerald-500/30 text-xs">published</Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  {format(new Date(event.start), "MMM d, yyyy")} • $75
                </div>
                <div className="flex gap-2 mt-2">
                  <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white">
                    ✓ Approve
                  </Button>
                  <Button size="sm" variant="outline">
                    <span className="mr-1">📄</span> Edit
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-card/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>Official Payments</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { name: "John Doe", event: "Warriors vs Eagles", amount: "$75", status: "pending" },
              { name: "Jane Smith", event: "Lions vs Tigers", amount: "$60", status: "paid" },
              { name: "Mike Johnson", event: "Spartans vs Trojans", amount: "$65", status: "pending" },
            ].map((payment, i) => (
              <div key={i} className="rounded-lg border bg-background/60 p-3 flex items-center justify-between">
                <div>
                  <div className="font-medium text-foreground">{payment.name}</div>
                  <div className="text-sm text-muted-foreground">{payment.event}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-foreground">{payment.amount}</div>
                  {payment.status === 'paid' ? (
                    <Badge className="bg-emerald-500/20 text-emerald-500 border-emerald-500/30 text-xs">paid</Badge>
                  ) : (
                    <div className="text-xs text-muted-foreground">pending</div>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card/80">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>Coach Assignments</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-3">
            {teams.slice(0, 4).map((team: any) => (
              <div key={team.id} className="rounded-lg border bg-background/60 p-3 text-center">
                <div className="font-medium text-foreground">{team.name}</div>
                <div className="text-sm text-muted-foreground mt-1">Coach: Assigned</div>
                <Button size="sm" variant="outline" className="w-full mt-2">
                  Assign Coach
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <RecentActivitySection activity={recentActivity} />
    </>
  );
}

// Official Dashboard
function OfficialDashboard({ events, assignments, recentActivity }: any) {
  return (
    <>
      <Card className="bg-card/80">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>Available Events</span>
          </CardTitle>
          <p className="text-sm text-muted-foreground">Browse and request to work upcoming games</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {events.slice(0, 6).map((event: any) => (
              <div key={event.id} className="rounded-lg border bg-background/60 p-4">
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="outline" className="text-xs">Varsity</Badge>
                </div>
                <div className="font-medium text-foreground mb-2">{event.title}</div>
                <div className="space-y-1 text-xs text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <span>🏀</span> <span>Basketball • Varsity</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>📅</span> <span>{format(new Date(event.start), "MMM d, yyyy 'at' h:mm a")}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>📍</span> <span>Central High School Gym</span>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <div className="text-emerald-500 font-semibold">$75/game</div>
                  <div className="text-xs text-muted-foreground">2 officials needed</div>
                </div>
                <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white">
                  Request to Work
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-card/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>My Notifications</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border bg-background/60 p-8 text-center text-muted-foreground">
              No notifications
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>Submit Game Report</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Event</label>
              <select className="w-full rounded-lg border bg-background px-3 py-2">
                <option>Select completed event</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Report Notes</label>
              <textarea
                className="w-full rounded-lg border bg-background px-3 py-2 min-h-[100px]"
                placeholder="Enter game details, scores, incidents..."
              />
            </div>
            <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white">
              <span className="mr-2">✈</span> Submit Report
            </Button>
          </CardContent>
        </Card>
      </div>

      <RecentActivitySection activity={recentActivity} />
    </>
  );
}

// Recent Activity Component
function RecentActivitySection({ activity }: any) {
  const roleTags: Record<string, string> = {
    'New schedule request received': 'School Admin',
    'Event approved successfully': 'Athletic Director',
    'Official assigned to event': 'League Admin',
  };

  return (
    <Card className="bg-card/80">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>Recent Activity</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {activity.map((entry: any) => (
          <div key={entry.id} className="rounded-lg border bg-background/60 p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <span className="text-emerald-500">🔔</span>
              </div>
              <div>
                <div className="text-sm font-medium text-foreground">{entry.message}</div>
                <div className="text-xs text-muted-foreground">
                  {format(new Date(entry.timestamp), "MMM d, yyyy 'at' h:mm a")}
                </div>
              </div>
            </div>
            <Badge variant="outline" className="text-xs">
              {roleTags[entry.message] || 'System'}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
