'use client';

import { addDays, format } from "date-fns";
import Link from "next/link";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import {
  DemoAssignment,
  DemoEvent,
  DemoFeatureFlags,
  DemoRequest,
  DemoUser,
} from "../_data/mockData";
import { useDemoStore } from "../_state/demoStore";

const sectionMetadata: Record<
  string,
  { title: string; description: string }
> = {
  leagues: {
    title: "Leagues",
    description: "Govern your league settings, communication, and contacts.",
  },
  schools: {
    title: "Schools",
    description: "Track participating schools with locations and mascots.",
  },
  teams: {
    title: "Teams",
    description: "View team records, levels, and sport assignments.",
  },
  venues: {
    title: "Venues",
    description: "Manage sites, capacities, and logistics details.",
  },
  users: {
    title: "Users & Roles",
    description: "Control staffing, access levels, and invitations.",
  },
  events: {
    title: "Events",
    description: "Filter and inspect upcoming and historical matchups.",
  },
  officials: {
    title: "Officials Directory",
    description: "Search by sport, availability, and certification.",
  },
  requests: {
    title: "Requests",
    description: "Review and filter all work requests across crews.",
  },
  approvals: {
    title: "Approvals",
    description: "Confirm or decline pending work requests.",
  },
  assignments: {
    title: "Assignments",
    description: "See confirmed crews per event with positions.",
  },
  announcements: {
    title: "Announcements",
    description: "Publish updates to officials, coaches, and ADs.",
  },
  "feature-flags": {
    title: "Feature Flags",
    description: "Toggle experiments and beta surfaces instantly.",
  },
  settings: {
    title: "Settings",
    description: "Manage branding, email templates, and rate limits.",
  },
  analytics: {
    title: "Analytics",
    description: "Visualize performance by sport, requests, and staffing.",
  },
  activity: {
    title: "Activity",
    description: "Review the latest actions captured across the mock environment.",
  },
  "api-explorer": {
    title: "API Explorer",
    description: "Documented endpoints ready for integration teams.",
  },
  "dev-tools": {
    title: "Developer Tools",
    description: "Generate demo data, wipe the store, or reseed quickly.",
  },
};

export default function DemoSectionPage({
  params,
}: {
  params: { section: string };
}) {
  const { section } = params;
  const metadata = sectionMetadata[section];

  if (!metadata) {
    return (
      <div className="space-y-4">
        <nav className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Demo / Unknown
        </nav>
        <Card className="bg-card/80">
          <CardHeader>
            <CardTitle>Page coming soon</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            This section isn&apos;t wired up in the demo yet. Try another item from the sidebar.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <nav className="text-xs uppercase tracking-[0.3em] text-[hsl(var(--accent))]">
          Demo / {metadata.title}
        </nav>
        <h1 className="text-3xl font-semibold tracking-tight">
          {metadata.title}
        </h1>
        <p className="text-sm text-muted-foreground">{metadata.description}</p>
      </header>

      {renderSection(section)}
    </div>
  );
}

function renderSection(section: string) {
  switch (section) {
    case "leagues":
      return <LeaguesSection />;
    case "schools":
      return <SchoolsSection />;
    case "teams":
      return <TeamsSection />;
    case "venues":
      return <VenuesSection />;
    case "users":
      return <UsersSection />;
    case "events":
      return <EventsSection />;
    case "officials":
      return <OfficialsSection />;
    case "requests":
      return <RequestsSection />;
    case "approvals":
      return <ApprovalsSection />;
    case "assignments":
      return <AssignmentsSection />;
    case "announcements":
      return <AnnouncementsSection />;
    case "feature-flags":
      return <FeatureFlagsSection />;
    case "settings":
      return <SettingsSection />;
    case "analytics":
      return <AnalyticsSection />;
    case "activity":
      return <ActivitySection />;
    case "api-explorer":
      return <ApiExplorerSection />;
    case "dev-tools":
      return <DevToolsSection />;
    default:
      return null;
  }
}

function LeaguesSection() {
  const leagues = useDemoStore((state) => state.leagues);
  return (
    <EntityTable
      data={leagues}
      columns={[
        { key: "name", label: "Name", sortable: true },
        { key: "region", label: "Region", sortable: true },
        { key: "contactEmail", label: "Contact" },
      ]}
      searchKeys={["name", "region", "contactEmail"]}
      getTitle={(item) => item.name}
      renderDetails={(league) => (
        <div className="space-y-2">
          <p>
            <strong>Region:</strong> {league.region}
          </p>
          <p>
            <strong>Email:</strong> {league.contactEmail}
          </p>
        </div>
      )}
    />
  );
}

function SchoolsSection() {
  const schools = useDemoStore((state) => state.schools);
  const leagueLookup = useDemoStore((state) =>
    Object.fromEntries(state.leagues.map((league) => [league.id, league.name])),
  );

  return (
    <EntityTable
      data={schools}
      columns={[
        { key: "name", label: "School", sortable: true },
        {
          key: "leagueId",
          label: "League",
          render: (school) => leagueLookup[school.leagueId] ?? "—",
        },
        { key: "city", label: "City", sortable: true },
        { key: "state", label: "State", sortable: true },
      ]}
      searchKeys={["name", "city", "state"]}
      getTitle={(item) => item.name}
      renderDetails={(school) => (
        <div className="space-y-2">
          <p>
            <strong>League:</strong> {leagueLookup[school.leagueId]}
          </p>
          <p>
            <strong>Location:</strong> {school.city}, {school.state}
          </p>
          <p>
            <strong>Mascot:</strong> {school.mascot}
          </p>
        </div>
      )}
    />
  );
}

function TeamsSection() {
  const teams = useDemoStore((state) => state.teams);
  const schoolLookup = useDemoStore((state) =>
    Object.fromEntries(state.schools.map((school) => [school.id, school.name])),
  );

  return (
    <EntityTable
      data={teams}
      columns={[
        { key: "name", label: "Team", sortable: true },
        {
          key: "schoolId",
          label: "School",
          render: (team) => schoolLookup[team.schoolId] ?? "—",
        },
        { key: "sport", label: "Sport", sortable: true },
        { key: "level", label: "Level", sortable: true },
        { key: "record", label: "Record" },
      ]}
      searchKeys={["name", "sport", "level", "record"]}
      getTitle={(item) => item.name}
      renderDetails={(team) => (
        <div className="space-y-2">
          <p>
            <strong>School:</strong> {schoolLookup[team.schoolId]}
          </p>
          <p>
            <strong>Sport / Level:</strong> {team.sport} · {team.level}
          </p>
          <p>
            <strong>Record:</strong> {team.record}
          </p>
        </div>
      )}
    />
  );
}

function VenuesSection() {
  const venues = useDemoStore((state) => state.venues);
  return (
    <EntityTable
      data={venues}
      columns={[
        { key: "name", label: "Venue", sortable: true },
        { key: "city", label: "City", sortable: true },
        { key: "state", label: "State", sortable: true },
        { key: "capacity", label: "Capacity", sortable: true },
      ]}
      searchKeys={["name", "city", "state"]}
      getTitle={(item) => item.name}
      renderDetails={(venue) => (
        <div className="space-y-2">
          <p>
            <strong>Address:</strong> {venue.address}
          </p>
          <p>
            <strong>Capacity:</strong> {venue.capacity.toLocaleString()}
          </p>
          <p>
            <strong>Location:</strong> {venue.city}, {venue.state}
          </p>
        </div>
      )}
    />
  );
}

function UsersSection() {
  const users = useDemoStore((state) => state.users);
  const activeUserId = useDemoStore((state) => state.activeUserId);
  const updateUserRole = useDemoStore((state) => state.updateUserRole);
  const currentRole = useDemoStore((state) => state.currentRole);

  return (
    <EntityTable
      data={users}
      columns={[
        { key: "name", label: "Name", sortable: true },
        { key: "email", label: "Email" },
        {
          key: "role",
          label: "Role",
          render: (user) => (
            <span className="rounded-full bg-[hsl(var(--accent)/0.12)] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[hsl(var(--accent))]">
              {user.role}
            </span>
          ),
        },
        { key: "status", label: "Status", sortable: true },
      ]}
      searchKeys={["name", "email", "role", "status"]}
      getTitle={(item) => item.name}
      renderDetails={(user) => (
        <div className="space-y-3">
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Sports:</strong> {user.sports.join(", ")}
          </p>
          <p>
            <strong>Availability:</strong> {user.availability.join(", ")}
          </p>
          <div className="space-y-2">
            <Label htmlFor={`role-${user.id}`}>Change role</Label>
            <Select
              value={user.role}
              onValueChange={(value) => updateUserRole(user.id, value as DemoUser["role"])}
              disabled={currentRole !== "SUPER_ADMIN" || user.id === activeUserId}
            >
              <SelectTrigger id={`role-${user.id}`} className="w-full border-border">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent className="bg-card text-card-foreground">
                {["SUPER_ADMIN", "ADMIN", "AD", "COACH", "OFFICIAL", "STAFF"].map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {currentRole !== "SUPER_ADMIN" ? (
              <p className="text-xs text-muted-foreground">
                Role changes available to super admins only.
              </p>
            ) : null}
          </div>
        </div>
      )}
    />
  );
}

function EventsSection() {
  const events = useDemoStore((state) => state.events);
  const leagues = useDemoStore((state) => state.leagues);
  const schools = useDemoStore((state) => state.schools);
  const teams = useDemoStore((state) => state.teams);
  const venues = useDemoStore((state) => state.venues);

  const [filters, setFilters] = useState({
    league: "all",
    school: "all",
    sport: "all",
    level: "all",
    date: "next7",
    search: "",
  });

  const filteredEvents = useMemo(() => {
    const searchTerm = filters.search.toLowerCase();
    const maxDate =
      filters.date === "all"
        ? null
        : filters.date === "next30"
        ? addDays(new Date(), 30)
        : addDays(new Date(), 7);

    return events.filter((event) => {
      if (filters.league !== "all" && event.leagueId !== filters.league) return false;
      if (filters.school !== "all" && event.schoolId !== filters.school) return false;
      if (filters.sport !== "all" && event.sport !== filters.sport) return false;
      if (filters.level !== "all" && event.level !== filters.level) return false;
      if (filters.date !== "all" && maxDate) {
        if (new Date(event.start) > maxDate) return false;
      }
      if (searchTerm) {
        const haystack = `${event.title} ${event.sport} ${event.level}`.toLowerCase();
        if (!haystack.includes(searchTerm)) return false;
      }
      return true;
    });
  }, [events, filters]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-5">
        <Select
          value={filters.league}
          onValueChange={(value) => setFilters((prev) => ({ ...prev, league: value }))}
        >
          <SelectTrigger className="bg-card">
            <SelectValue placeholder="League" />
          </SelectTrigger>
          <SelectContent className="bg-card text-card-foreground">
            <SelectItem value="all">All leagues</SelectItem>
            {leagues.map((league) => (
              <SelectItem key={league.id} value={league.id}>
                {league.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={filters.school}
          onValueChange={(value) => setFilters((prev) => ({ ...prev, school: value }))}
        >
          <SelectTrigger className="bg-card">
            <SelectValue placeholder="School" />
          </SelectTrigger>
          <SelectContent className="bg-card text-card-foreground">
            <SelectItem value="all">All schools</SelectItem>
            {schools.map((school) => (
              <SelectItem key={school.id} value={school.id}>
                {school.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={filters.sport}
          onValueChange={(value) => setFilters((prev) => ({ ...prev, sport: value }))}
        >
          <SelectTrigger className="bg-card">
            <SelectValue placeholder="Sport" />
          </SelectTrigger>
          <SelectContent className="bg-card text-card-foreground">
            <SelectItem value="all">All sports</SelectItem>
            {[...new Set(events.map((event) => event.sport))].map((sport) => (
              <SelectItem key={sport} value={sport}>
                {sport}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={filters.level}
          onValueChange={(value) => setFilters((prev) => ({ ...prev, level: value }))}
        >
          <SelectTrigger className="bg-card">
            <SelectValue placeholder="Level" />
          </SelectTrigger>
          <SelectContent className="bg-card text-card-foreground">
            <SelectItem value="all">All levels</SelectItem>
            {[...new Set(events.map((event) => event.level))].map((level) => (
              <SelectItem key={level} value={level}>
                {level}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={filters.date}
          onValueChange={(value) => setFilters((prev) => ({ ...prev, date: value }))}
        >
          <SelectTrigger className="bg-card">
            <SelectValue placeholder="Date range" />
          </SelectTrigger>
          <SelectContent className="bg-card text-card-foreground">
            <SelectItem value="next7">Next 7 days</SelectItem>
            <SelectItem value="next30">Next 30 days</SelectItem>
            <SelectItem value="all">Any date</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Input
        value={filters.search}
        onChange={(event) => setFilters((prev) => ({ ...prev, search: event.target.value }))}
        placeholder="Search events..."
        className="bg-card"
      />

      <div className="grid gap-4">
        {filteredEvents.length === 0 ? (
          <Card className="bg-card/80">
            <CardContent className="py-10 text-center text-sm text-muted-foreground">
              No events match those filters yet. Try widening your selection.
            </CardContent>
          </Card>
        ) : (
          filteredEvents.map((event) => {
            const homeTeam = teams.find((team) => team.id === event.homeTeamId);
            const awayTeam = teams.find((team) => team.id === event.awayTeamId);
            const venue = venues.find((v) => v.id === event.venueId);
            return (
              <Card key={event.id} className="bg-card/80">
                <CardContent className="flex flex-col gap-3 py-5 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {event.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(event.start), "MMM d, yyyy · h:mm a")} · {event.sport} ·{" "}
                      {event.level}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {venue?.name} · {venue?.city}, {venue?.state}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className="bg-[hsl(var(--accent)/0.2)] text-[hsl(var(--accent))]">
                      {event.status}
                    </Badge>
                    <Button asChild variant="outline" className="border-[hsl(var(--accent)/0.4)]">
                      <Link href={`/demo/events/${event.id}`}>View</Link>
                    </Button>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {homeTeam?.name} vs {awayTeam?.name}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}

function OfficialsSection() {
  const officials = useDemoStore((state) =>
    state.users.filter((user) => user.role === "official"),
  );
  const [search, setSearch] = useState("");

  const filtered = officials.filter((official) => {
    const term = search.toLowerCase();
    if (!term) return true;
    const haystack = `${official.name} ${official.email} ${official.sports.join(" ")}`.toLowerCase();
    return haystack.includes(term);
  });

  return (
    <div className="space-y-4">
      <Input
        className="bg-card"
        placeholder="Search officials by name, sport, or email"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((official) => (
          <Card key={official.id} className="bg-card/80">
            <CardHeader>
              <CardTitle className="text-lg">{official.name}</CardTitle>
              <p className="text-xs text-muted-foreground">{official.email}</p>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div>
                <p className="font-semibold text-foreground">Sports</p>
                <p>{official.sports.join(", ")}</p>
              </div>
              <div>
                <p className="font-semibold text-foreground">Availability</p>
                <p>{official.availability.join(", ")}</p>
              </div>
              <Badge className="bg-[hsl(var(--accent)/0.2)] text-[hsl(var(--accent))]">
                {official.status}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function RequestsSection() {
  const requests = useDemoStore((state) => state.requests);
  const users = useDemoStore((state) => state.users);
  const events = useDemoStore((state) => state.events);
  const approveRequest = useDemoStore((state) => state.approveRequest);
  const declineRequest = useDemoStore((state) => state.declineRequest);
  const approveRequests = useDemoStore((state) => state.approveRequests);
  const declineRequests = useDemoStore((state) => state.declineRequests);
  const { toast } = useToast();
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filtered = requests.filter((request) => {
    if (statusFilter === "all") return true;
    return request.status === statusFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48 bg-card">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent className="bg-card text-card-foreground">
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="APPROVED">Approved</SelectItem>
            <SelectItem value="DECLINED">Declined</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-xs text-muted-foreground">
          Showing {filtered.length} of {requests.length} requests
        </span>
        <div className="ml-auto flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="border-[hsl(var(--accent)/0.4)] text-xs"
            onClick={() => {
              const pendingIds = filtered
                .filter((request) => request.status === "PENDING")
                .map((request) => request.id);
              approveRequests(pendingIds);
              toast({
                title: "Bulk approve",
                description: pendingIds.length
                  ? "All pending requests in view were approved."
                  : "No pending requests to approve in view.",
              });
            }}
          >
            Approve visible
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-red-500/40 text-xs text-red-300"
            onClick={() => {
              const pendingIds = filtered
                .filter((request) => request.status === "PENDING")
                .map((request) => request.id);
              declineRequests(pendingIds);
              toast({
                title: "Bulk decline",
                description: pendingIds.length
                  ? "All pending requests in view were declined."
                  : "No pending requests to decline in view.",
              });
            }}
          >
            Decline visible
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card/80">
        <table className="min-w-full divide-y divide-border/80 text-sm">
          <thead className="bg-background/60 text-xs uppercase tracking-[0.3em] text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left">Official</th>
              <th className="px-4 py-3 text-left">Event</th>
              <th className="px-4 py-3 text-left">Submitted</th>
              <th className="px-4 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {filtered.map((request) => {
              const user = users.find((u) => u.id === request.userId);
              const event = events.find((e) => e.id === request.eventId);
              return (
                <tr key={request.id} className="text-muted-foreground">
                  <td className="px-4 py-3">
                    <p className="font-medium text-foreground">{user?.name}</p>
                    <p className="text-xs">{user?.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/demo/events/${event?.id ?? ""}`}
                      className="text-sm text-[hsl(var(--accent))] hover:underline"
                    >
                      {event?.title ?? "Unknown"}
                    </Link>
                    <p className="text-xs">
                      {event?.sport} · {event?.level}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-xs">
                    {format(new Date(request.submittedAt), "MMM d, h:mm a")}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      className={cn(
                        "px-3 py-1 text-xs",
                        request.status === "PENDING" && "bg-[hsl(var(--accent)/0.2)] text-[hsl(var(--accent))]",
                        request.status === "APPROVED" && "bg-emerald-500/20 text-emerald-300",
                        request.status === "DECLINED" && "bg-red-500/20 text-red-300",
                      )}
                    >
                      {request.status}
                    </Badge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ApprovalsSection() {
  const pendingRequests = useDemoStore((state) =>
    state.requests.filter((req) => req.status === "PENDING"),
  );
  const approveRequest = useDemoStore((state) => state.approveRequest);
  const declineRequest = useDemoStore((state) => state.declineRequest);
  const users = useDemoStore((state) => state.users);
  const events = useDemoStore((state) => state.events);
  const { toast } = useToast();

  if (pendingRequests.length === 0) {
    return (
      <Card className="bg-card/80">
        <CardContent className="py-10 text-center text-sm text-muted-foreground">
          No approvals waiting. When officials request assignments, they&apos;ll appear here.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {pendingRequests.map((request) => {
        const user = users.find((u) => u.id === request.userId);
        const event = events.find((e) => e.id === request.eventId);
        return (
          <Card key={request.id} className="bg-card/80">
            <CardHeader>
              <CardTitle className="text-lg">{user?.name}</CardTitle>
              <p className="text-xs text-muted-foreground">
                {event?.title} · {format(new Date(request.submittedAt), "MMM d, h:mm a")}
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                {request.message ?? "No message provided."}
              </p>
              <div className="flex gap-3">
                <Button
                  className="bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30"
                  onClick={() => {
                    approveRequest(request.id);
                    toast({
                      title: "Request approved",
                      description: `${user?.name} assigned to ${event?.title}.`,
                    });
                  }}
                >
                  Approve
                </Button>
                <Button
                  variant="outline"
                  className="border-red-500/40 text-red-300 hover:bg-red-500/10"
                  onClick={() => {
                    declineRequest(request.id);
                    toast({
                      title: "Request declined",
                      description: `${user?.name} was notified.`,
                    });
                  }}
                >
                  Decline
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function AssignmentsSection() {
  const assignments = useDemoStore((state) => state.assignments);
  const users = useDemoStore((state) => state.users);
  const events = useDemoStore((state) => state.events);

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card/80">
      <table className="min-w-full divide-y divide-border/60 text-sm">
        <thead className="bg-background/60 text-xs uppercase tracking-[0.3em] text-muted-foreground">
          <tr>
            <th className="px-4 py-3 text-left">Official</th>
            <th className="px-4 py-3 text-left">Event</th>
            <th className="px-4 py-3 text-left">Position</th>
            <th className="px-4 py-3 text-left">Confirmed</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60">
          {assignments.map((assignment) => {
            const user = users.find((u) => u.id === assignment.userId);
            const event = events.find((e) => e.id === assignment.eventId);
            return (
              <tr key={assignment.id} className="text-muted-foreground">
                <td className="px-4 py-3 text-foreground">{user?.name}</td>
                <td className="px-4 py-3">
                  <Link
                    href={`/demo/events/${event?.id ?? ""}`}
                    className="text-[hsl(var(--accent))] hover:underline"
                  >
                    {event?.title ?? "Unknown"}
                  </Link>
                </td>
                <td className="px-4 py-3">{assignment.position}</td>
                <td className="px-4 py-3 text-xs">
                  {format(new Date(assignment.confirmedAt), "MMM d, h:mm a")}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function AnnouncementsSection() {
  const announcements = useDemoStore((state) => state.announcements);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {announcements.map((announcement) => (
        <Card key={announcement.id} className="bg-card/80">
          <CardHeader>
            <CardTitle className="text-lg">{announcement.title}</CardTitle>
            <p className="text-xs text-muted-foreground">
              {format(new Date(announcement.createdAt), "MMM d, h:mm a")}
            </p>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {announcement.body}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function FeatureFlagsSection() {
  const featureFlags = useDemoStore((state) => state.featureFlags);
  const toggleFlag = useDemoStore((state) => state.toggleFlag);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {Object.entries(featureFlags).map(([key, value]) => (
        <Card key={key} className="bg-card/80">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">
              {key}
            </CardTitle>
            <Switch
              checked={value}
              onCheckedChange={() => toggleFlag(key as keyof typeof featureFlags)}
            />
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {flagDescriptions[key as keyof typeof featureFlags]}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

const flagDescriptions: Record<keyof DemoFeatureFlags, string> = {
  MOCK_DATA_ENABLED: "Enables in-memory demo data for all sections.",
  EXPERIMENTAL_UI: "Shows upcoming UI treatments and components.",
  BETA_ANALYTICS: "Unlocks beta analytics tiles across the dashboard.",
};

function SettingsSection() {
  const branding = useDemoStore((state) => state.branding);
  const setBranding = useDemoStore((state) => state.setBranding);
  const rateLimits = useDemoStore((state) => state.rateLimits);
  const setRateLimits = useDemoStore((state) => state.setRateLimits);
  const [openTemplate, setOpenTemplate] = useState<string | null>(null);

  const emailTemplates = [
    { id: "waitlist", title: "Waitlist confirmation", preview: "Thanks for joining The Official App waitlist." },
    { id: "request", title: "Request received", preview: "We received your request to work Friday's event." },
    { id: "approved", title: "Assignment approved", preview: "You're confirmed for the upcoming matchup. Details inside." },
    { id: "magic", title: "Magic code login", preview: "Use this code to sign in securely without a password." },
  ];

  return (
    <div className="space-y-8">
      <Card className="bg-card/80">
        <CardHeader>
          <CardTitle>Branding</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full border border-[hsl(var(--accent)/0.4)] bg-background/80">
            {branding.logoDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={branding.logoDataUrl} alt="Uploaded branding" className="h-full w-full rounded-full object-cover" />
            ) : (
              <span className="text-3xl">🏀</span>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="branding-upload">Upload logo</Label>
            <Input
              id="branding-upload"
              type="file"
              accept="image/*"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (!file) {
                  setBranding(undefined);
                  return;
                }
                const reader = new FileReader();
                reader.onload = () => {
                  setBranding(reader.result as string);
                };
                reader.readAsDataURL(file);
              }}
            />
            <p className="text-xs text-muted-foreground">
              Upload a PNG or SVG to preview in the demo header instantly.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card/80">
        <CardHeader>
          <CardTitle>Email templates</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          {emailTemplates.map((template) => (
            <div key={template.id} className="rounded-xl border border-border/50 bg-background/60 p-4">
              <h3 className="text-sm font-semibold text-foreground">{template.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{template.preview}</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3 border-[hsl(var(--accent)/0.4)]"
                onClick={() => setOpenTemplate(template.id)}
              >
                Preview
              </Button>
              {openTemplate === template.id ? (
                <div className="mt-4 space-y-2 rounded-xl border border-border/40 bg-background/80 p-4 text-sm">
                  <p className="font-semibold text-foreground">{template.title}</p>
                  <p className="text-muted-foreground">
                    This is a mock preview. In production, this would render using your branding and personalization tokens.
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[hsl(var(--accent))]"
                    onClick={() => setOpenTemplate(null)}
                  >
                    Close preview
                  </Button>
                </div>
              ) : null}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="bg-card/80">
        <CardHeader>
          <CardTitle>Rate limits</CardTitle>
          <p className="text-xs text-muted-foreground">
            Mocked sliders to mirror Upstash-style throttling.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="burst-limit">Burst limit (per minute)</Label>
            <input
              id="burst-limit"
              type="range"
              min={60}
              max={360}
              value={rateLimits.burst}
              onChange={(event) =>
                setRateLimits({ burst: Number(event.target.value), sustained: rateLimits.sustained })
              }
              className="w-full accent-[hsl(var(--accent))]"
            />
            <p className="text-xs text-muted-foreground">{rateLimits.burst} requests/minute</p>
          </div>
          <div>
            <Label htmlFor="sustained-limit">Sustained limit (per hour)</Label>
            <input
              id="sustained-limit"
              type="range"
              min={200}
              max={5000}
              step={50}
              value={rateLimits.sustained}
              onChange={(event) =>
                setRateLimits({ burst: rateLimits.burst, sustained: Number(event.target.value) })
              }
              className="w-full accent-[hsl(var(--accent))]"
            />
            <p className="text-xs text-muted-foreground">{rateLimits.sustained} requests/hour</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AnalyticsSection() {
  const events = useDemoStore((state) => state.events);
  const requests = useDemoStore((state) => state.requests);
  const assignments = useDemoStore((state) => state.assignments);

  const eventsBySport = useMemo(() => {
    const tally: Record<string, number> = {};
    events.forEach((event) => {
      tally[event.sport] = (tally[event.sport] ?? 0) + 1;
    });
    return tally;
  }, [events]);

  const requestsByStatus = useMemo(() => {
    const tally: Record<string, number> = { PENDING: 0, APPROVED: 0, DECLINED: 0 };
    requests.forEach((request) => {
      tally[request.status] = (tally[request.status] ?? 0) + 1;
    });
    return tally;
  }, [requests]);

  const assignmentsPerOfficial = useMemo(() => {
    const tally: Record<string, number> = {};
    assignments.forEach((assignment) => {
      tally[assignment.userId] = (tally[assignment.userId] ?? 0) + 1;
    });
    return tally;
  }, [assignments]);

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <AnalyticsCard
        title="Events by sport"
        data={eventsBySport}
        paletteClass="bg-[hsl(var(--accent)/0.2)]"
      />
      <AnalyticsCard
        title="Requests by status"
        data={requestsByStatus}
        paletteClass="bg-emerald-500/20"
      />
      <AnalyticsCard
        title="Assignments per official"
        data={assignmentsPerOfficial}
        paletteClass="bg-sky-500/20"
      />
    </div>
  );
}

function AnalyticsCard({
  title,
  data,
  paletteClass,
}: {
  title: string;
  data: Record<string, number>;
  paletteClass: string;
}) {
  const entries = Object.entries(data);
  const maxValue = Math.max(...entries.map((entry) => entry[1]), 1);

  return (
    <Card className="bg-card/80">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {entries.map(([label, value]) => (
          <div key={label}>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{label}</span>
              <span>{value}</span>
            </div>
            <div className="mt-1 h-2 rounded-full bg-border/60">
              <div
                className={cn("h-2 rounded-full", paletteClass)}
                style={{ width: `${(value / maxValue) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function ActivitySection() {
  const activity = useDemoStore((state) => state.activity);

  return (
    <div className="space-y-4">
      {activity.length === 0 ? (
        <Card className="bg-card/80">
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            No actions logged yet. Trigger approvals, requests, or feature flag toggles in other sections to see updates here.
          </CardContent>
        </Card>
      ) : (
        activity.map((entry) => (
          <Card key={entry.id} className="bg-card/80">
            <CardHeader>
              <CardTitle className="text-base">{entry.message}</CardTitle>
              <p className="text-xs text-muted-foreground">
                {format(new Date(entry.timestamp), "MMM d, h:mm a")}
              </p>
            </CardHeader>
          </Card>
        ))
      )}
    </div>
  );
}

function ApiExplorerSection() {
  const endpoints = [
    {
      method: "GET",
      url: "/api/events",
      description: "Retrieve upcoming events for the authenticated league.",
      response: { events: [{ id: "event-1", title: "Central vs Riverdale" }] },
    },
    {
      method: "POST",
      url: "/api/requests",
      description: "Officials submit a request to work an event.",
      body: { eventId: "event-1", message: "Available Friday evening" },
    },
    {
      method: "POST",
      url: "/api/requests/:id/approve",
      description: "AD or assignor approves a request and notifies the crew.",
      body: { payRate: 85, crewPosition: "Referee" },
    },
    {
      method: "GET",
      url: "/api/feature-flags",
      description: "Fetch feature flag state for the current tenant.",
      response: { MOCK_DATA_ENABLED: true, EXPERIMENTAL_UI: false },
    },
    {
      method: "POST",
      url: "/api/waitlist",
      description: "Join the waitlist from the marketing page.",
      body: { name: "Jordan", email: "jordan@example.com" },
    },
  ];

  return (
    <div className="grid gap-4">
      {endpoints.map((endpoint) => (
        <Card key={endpoint.url} className="bg-card/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-base">
              <span className="rounded-full border border-border px-3 py-1 text-xs uppercase tracking-[0.3em] text-[hsl(var(--accent))]">
                {endpoint.method}
              </span>
              {endpoint.url}
            </CardTitle>
            <p className="text-xs text-muted-foreground">{endpoint.description}</p>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            {endpoint.body ? (
              <pre className="rounded-lg border border-border/60 bg-background/70 p-3 text-[11px] text-muted-foreground">
                {JSON.stringify(endpoint.body, null, 2)}
              </pre>
            ) : null}
            {endpoint.response ? (
              <pre className="rounded-lg border border-border/60 bg-background/70 p-3 text-[11px] text-muted-foreground">
                {JSON.stringify(endpoint.response, null, 2)}
              </pre>
            ) : null}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function DevToolsSection() {
  const generateSample = useDemoStore((state) => state.generateSample);
  const wipeStore = useDemoStore((state) => state.wipeStore);
  const reseed = useDemoStore((state) => state.reseed);
  const activity = useDemoStore((state) => state.activity);
  const { toast } = useToast();

  return (
    <div className="grid gap-6 lg:grid-cols-[280px,1fr]">
      <div className="space-y-3">
        <Button
          className="w-full bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))]"
          onClick={() => {
            generateSample(50);
            toast({
              title: "Sample schools generated",
              description: "Fifty schools, teams, and events were added to the store.",
            });
          }}
        >
          Generate 50 sample schools
        </Button>
        <Button
          variant="outline"
          className="w-full border-red-500/40 text-red-300 hover:bg-red-500/10"
          onClick={() => {
            wipeStore();
            toast({
              title: "Demo store cleared",
              description: "All in-memory data removed. Reseed to restore defaults.",
            });
          }}
        >
          Wipe store
        </Button>
        <Button
          variant="outline"
          className="w-full border-[hsl(var(--accent)/0.4)] hover:bg-[hsl(var(--accent)/0.1)]"
          onClick={() => {
            reseed();
            toast({
              title: "Demo store reseeded",
              description: "Default data restored successfully.",
            });
          }}
        >
          Reseed
        </Button>
      </div>
      <Card className="bg-card/80">
        <CardHeader>
          <CardTitle>Action console</CardTitle>
          <p className="text-xs text-muted-foreground">
            Last ten interactions captured from the store.
          </p>
        </CardHeader>
        <CardContent className="space-y-3 text-xs text-muted-foreground">
          {activity.length === 0 ? (
            <p>No actions logged yet.</p>
          ) : (
            activity.map((entry) => (
              <div key={entry.id} className="rounded-lg border border-border/60 bg-background/70 p-3">
                <p className="text-foreground">{entry.message}</p>
                <p>{format(new Date(entry.timestamp), "MMM d, h:mm a")}</p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}

type EntityTableColumn<T> = {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
};

function EntityTable<T extends { id: string }>({
  data,
  columns,
  searchKeys,
  getTitle,
  renderDetails,
}: {
  data: T[];
  columns: EntityTableColumn<T>[];
  searchKeys: (keyof T)[];
  getTitle: (item: T) => string;
  renderDetails: (item: T) => React.ReactNode;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [selected, setSelected] = useState<T | null>(null);
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    const term = searchTerm.toLowerCase();
    let result = data.filter((item) => {
      if (!term) return true;
      return searchKeys.some((key) => {
        const value = item[key];
        if (!value) return false;
        return String(value).toLowerCase().includes(term);
      });
    });

    if (sortKey) {
      result = [...result].sort((a, b) => {
        const aValue = a[sortKey];
        const bValue = b[sortKey];
        const aString = String(aValue ?? "");
        const bString = String(bValue ?? "");
        if (sortDir === "asc") return aString.localeCompare(bString);
        return bString.localeCompare(aString);
      });
    }

    return result;
  }, [data, searchKeys, searchTerm, sortDir, sortKey]);

  return (
    <div className="space-y-4">
      <Input
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
        placeholder="Search..."
        className="bg-card"
      />
      <div className="overflow-hidden rounded-2xl border border-border bg-card/80">
        <table className="min-w-full divide-y divide-border/60 text-sm">
          <thead className="bg-background/60 text-xs uppercase tracking-[0.3em] text-muted-foreground">
            <tr>
              {columns.map((column) => (
                <th key={String(column.key)} className="px-4 py-3 text-left">
                  {column.sortable ? (
                    <button
                      type="button"
                      onClick={() => {
                        if (sortKey === column.key) {
                          setSortDir(sortDir === "asc" ? "desc" : "asc");
                        } else {
                          setSortKey(column.key);
                          setSortDir("asc");
                        }
                      }}
                      className="flex items-center gap-2 text-foreground"
                    >
                      {column.label}
                      {sortKey === column.key ? (sortDir === "asc" ? "↑" : "↓") : "↕"}
                    </button>
                  ) : (
                    column.label
                  )}
                </th>
              ))}
              <th className="px-4 py-3 text-left">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {filtered.map((item) => (
              <tr key={item.id} className="text-muted-foreground">
                {columns.map((column) => (
                  <td key={String(column.key)} className="px-4 py-3">
                    {column.render ? column.render(item) : String(item[column.key] ?? "—")}
                  </td>
                ))}
                <td className="px-4 py-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-[hsl(var(--accent)/0.4)] text-xs"
                    onClick={() => {
                      setSelected(item);
                      setOpen(true);
                    }}
                  >
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>{selected ? getTitle(selected) : "Details"}</SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-3 text-sm text-muted-foreground">
            {selected ? renderDetails(selected) : null}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
