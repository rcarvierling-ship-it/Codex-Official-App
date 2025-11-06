export type DemoRole =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "AD"
  | "COACH"
  | "OFFICIAL"
  | "STAFF";

export interface DemoLeague {
  id: string;
  name: string;
  region: string;
  contactEmail: string;
}

export interface DemoSchool {
  id: string;
  leagueId: string;
  name: string;
  mascot: string;
  city: string;
  state: string;
}

export interface DemoTeam {
  id: string;
  schoolId: string;
  name: string;
  sport: string;
  level: string;
  record: string;
}

export interface DemoVenue {
  id: string;
  name: string;
  capacity: number;
  address: string;
  city: string;
  state: string;
}

export interface DemoUser {
  id: string;
  name: string;
  email: string;
  role: DemoRole;
  status: "Active" | "Invited" | "Inactive";
  sports: string[];
  availability: string[];
}

export interface DemoEvent {
  id: string;
  title: string;
  leagueId: string;
  schoolId: string;
  homeTeamId: string;
  awayTeamId: string;
  venueId: string;
  sport: string;
  level: string;
  start: string;
  end: string;
  status: "Scheduled" | "In Progress" | "Completed";
  notes: string;
  createdBy: string;
}

export interface DemoRequest {
  id: string;
  eventId: string;
  userId: string;
  status: "PENDING" | "APPROVED" | "DECLINED";
  submittedAt: string;
  message?: string;
}

export interface DemoAssignment {
  id: string;
  eventId: string;
  userId: string;
  position: string;
  confirmedAt: string;
}

export interface DemoAnnouncement {
  id: string;
  title: string;
  body: string;
  createdAt: string;
}

export interface DemoFeatureFlags {
  MOCK_DATA_ENABLED: boolean;
  EXPERIMENTAL_UI: boolean;
  BETA_ANALYTICS: boolean;
}

export interface DemoAuditLog {
  id: string;
  message: string;
  timestamp: string;
}

export interface DemoWaitlistEntry {
  id: string;
  name: string;
  organization: string;
  role: string;
  createdAt: string;
}

export interface DemoNotification {
  id: string;
  summary: string;
  timestamp: string;
}

const now = new Date();

export const mockData = {
  leagues: [
    {
      id: "league-1",
      name: "Summit Athletic Association",
      region: "Midwest",
      contactEmail: "info@summitathletics.org",
    },
    {
      id: "league-2",
      name: "Coastal Prep League",
      region: "Southeast",
      contactEmail: "admin@coastalprep.org",
    },
    {
      id: "league-3",
      name: "Metro Elite Conference",
      region: "Northeast",
      contactEmail: "support@metroelite.org",
    },
  ] satisfies DemoLeague[],

  schools: [
    {
      id: "school-1",
      leagueId: "league-1",
      name: "Central High",
      mascot: "Lions",
      city: "Louisville",
      state: "KY",
    },
    {
      id: "school-2",
      leagueId: "league-1",
      name: "Riverdale Prep",
      mascot: "Eagles",
      city: "Indianapolis",
      state: "IN",
    },
    {
      id: "school-3",
      leagueId: "league-2",
      name: "Harborview Academy",
      mascot: "Pelicans",
      city: "Charleston",
      state: "SC",
    },
    {
      id: "school-4",
      leagueId: "league-3",
      name: "North Ridge",
      mascot: "Wolves",
      city: "Boston",
      state: "MA",
    },
  ] satisfies DemoSchool[],

  teams: [
    {
      id: "team-1",
      schoolId: "school-1",
      name: "Central Lions Varsity",
      sport: "Basketball",
      level: "Varsity",
      record: "18-3",
    },
    {
      id: "team-2",
      schoolId: "school-2",
      name: "Riverdale Eagles Varsity",
      sport: "Basketball",
      level: "Varsity",
      record: "16-5",
    },
    {
      id: "team-3",
      schoolId: "school-3",
      name: "Harborview Pelicans JV",
      sport: "Soccer",
      level: "JV",
      record: "9-4-2",
    },
    {
      id: "team-4",
      schoolId: "school-4",
      name: "North Ridge Wolves Varsity",
      sport: "Football",
      level: "Varsity",
      record: "11-1",
    },
  ] satisfies DemoTeam[],

  venues: [
    {
      id: "venue-1",
      name: "Central Fieldhouse",
      capacity: 2400,
      address: "100 Summit Ave",
      city: "Louisville",
      state: "KY",
    },
    {
      id: "venue-2",
      name: "Riverdale Pavilion",
      capacity: 1800,
      address: "55 Riverside Way",
      city: "Indianapolis",
      state: "IN",
    },
    {
      id: "venue-3",
      name: "Coastal Arena",
      capacity: 2200,
      address: "120 Ocean Blvd",
      city: "Charleston",
      state: "SC",
    },
  ] satisfies DemoVenue[],

  users: [
    {
      id: "user-superadmin",
      name: "Avery Thompson",
      email: "avery@theofficial.app",
      role: "SUPER_ADMIN",
      status: "Active",
      sports: ["Basketball", "Football"],
      availability: ["Weekdays", "Weekends"],
    },
    {
      id: "user-school-admin",
      name: "Dana Morales",
      email: "dana.morales@summitathletics.org",
      role: "ADMIN",
      status: "Active",
      sports: ["Basketball", "Soccer"],
      availability: ["Weekdays"],
    },
    {
      id: "user-ad",
      name: "Jordan Fisher",
      email: "jordan@centralhigh.edu",
      role: "AD",
      status: "Active",
      sports: ["Basketball", "Soccer"],
      availability: ["Weekdays"],
    },
    {
      id: "user-official-1",
      name: "Morgan Lee",
      email: "morgan.official@league.org",
      role: "OFFICIAL",
      status: "Active",
      sports: ["Basketball"],
      availability: ["Weeknights", "Weekends"],
    },
    {
      id: "user-official-2",
      name: "Riley Chen",
      email: "riley.official@league.org",
      role: "OFFICIAL",
      status: "Active",
      sports: ["Football", "Soccer"],
      availability: ["Weekends"],
    },
    {
      id: "user-coach",
      name: "Samira Patel",
      email: "spatel@harborview.edu",
      role: "COACH",
      status: "Active",
      sports: ["Soccer"],
      availability: ["Weekdays"],
    },
    {
      id: "user-viewer",
      name: "Casey Morgan",
      email: "casey.viewer@theofficial.app",
      role: "STAFF",
      status: "Active",
      sports: ["Basketball"],
      availability: ["Observer"],
    },
  ] satisfies DemoUser[],

  events: [
    {
      id: "event-1",
      title: "Central Lions vs Riverdale Eagles",
      leagueId: "league-1",
      schoolId: "school-1",
      homeTeamId: "team-1",
      awayTeamId: "team-2",
      venueId: "venue-1",
      sport: "Basketball",
      level: "Varsity",
      start: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      end: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
      status: "Scheduled",
      notes: "Throwback night. Confirm halftime entertainment.",
      createdBy: "user-ad",
    },
    {
      id: "event-2",
      title: "Pelicans vs Wolves",
      leagueId: "league-2",
      schoolId: "school-3",
      homeTeamId: "team-3",
      awayTeamId: "team-4",
      venueId: "venue-3",
      sport: "Soccer",
      level: "Varsity",
      start: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      end: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000).toISOString(),
      status: "Scheduled",
      notes: "Streaming on regional network.",
      createdBy: "user-superadmin",
    },
    {
      id: "event-3",
      title: "North Ridge Wolves vs Coastal All-Stars",
      leagueId: "league-3",
      schoolId: "school-4",
      homeTeamId: "team-4",
      awayTeamId: "team-2",
      venueId: "venue-2",
      sport: "Football",
      level: "Varsity",
      start: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      end: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(),
      status: "Completed",
      notes: "Scout attendance confirmed.",
      createdBy: "user-ad",
    },
    {
      id: "event-4",
      title: "Summit Showcase vs Metro Elite",
      leagueId: "league-1",
      schoolId: "school-2",
      homeTeamId: "team-2",
      awayTeamId: "team-1",
      venueId: "venue-2",
      sport: "Basketball",
      level: "JV",
      start: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      end: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000).toISOString(),
      status: "Scheduled",
      notes: "Officials requested; highlight youth mentorship.",
      createdBy: "user-school-admin",
    },
    {
      id: "event-5",
      title: "Riverdale Invitational",
      leagueId: "league-2",
      schoolId: "school-3",
      homeTeamId: "team-3",
      awayTeamId: "team-4",
      venueId: "venue-3",
      sport: "Soccer",
      level: "Varsity",
      start: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      end: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
      status: "Scheduled",
      notes: "Streamed with multi-camera replay.",
      createdBy: "user-ad",
    },
  ] satisfies DemoEvent[],

  requests: [
    {
      id: "request-1",
      eventId: "event-1",
      userId: "user-official-1",
      status: "PENDING",
      submittedAt: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString(),
      message: "Available to work varsity basketball doubleheader.",
    },
    {
      id: "request-2",
      eventId: "event-2",
      userId: "user-official-2",
      status: "APPROVED",
      submittedAt: new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString(),
      message: "Certified for varsity soccer assignments.",
    },
    {
      id: "request-3",
      eventId: "event-3",
      userId: "user-official-1",
      status: "DECLINED",
      submittedAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      message: "Conflict with travel. Pending future availability.",
    },
    {
      id: "request-4",
      eventId: "event-4",
      userId: "user-official-2",
      status: "PENDING",
      submittedAt: new Date(now.getTime() - 90 * 60 * 1000).toISOString(),
      message: "Available for showcase double-header.",
    },
    {
      id: "request-5",
      eventId: "event-5",
      userId: "user-official-1",
      status: "PENDING",
      submittedAt: new Date(now.getTime() - 30 * 60 * 1000).toISOString(),
      message: "Can run center referee if needed.",
    },
  ] satisfies DemoRequest[],

  assignments: [
    {
      id: "assignment-1",
      eventId: "event-2",
      userId: "user-official-2",
      position: "Referee Crew Chief",
      confirmedAt: new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "assignment-2",
      eventId: "event-1",
      userId: "user-official-1",
      position: "Lead Referee",
      confirmedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "assignment-3",
      eventId: "event-3",
      userId: "user-official-2",
      position: "Replay Official",
      confirmedAt: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
    },
  ] satisfies DemoAssignment[],

  announcements: [
    {
      id: "announcement-1",
      title: "Playoff schedules lock on Friday",
      body: "Confirm travel approvals for round one. Officials can update postseason availability in the portal.",
      createdAt: new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "announcement-2",
      title: "Officials onboarding session",
      body: "New basketball officials onboarding call is scheduled for Monday at 7pm ET.",
      createdAt: new Date(now.getTime() - 26 * 60 * 60 * 1000).toISOString(),
    },
  ] satisfies DemoAnnouncement[],

  featureFlags: {
    MOCK_DATA_ENABLED: true,
    EXPERIMENTAL_UI: false,
    BETA_ANALYTICS: true,
  } satisfies DemoFeatureFlags,

  waitlist: [
    {
      id: "demo-wl-1",
      name: "Jamie Rivera",
      organization: "Metro Catholic League",
      role: "AD",
      createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "demo-wl-2",
      name: "Taylor Brooks",
      organization: "Summit Officials Assoc.",
      role: "Official",
      createdAt: new Date(now.getTime() - 8 * 60 * 60 * 1000).toISOString(),
    },
  ] satisfies DemoWaitlistEntry[],

  auditLogs: [
    {
      id: "audit-1",
      message: "Jordan Fisher approved Morgan Lee for Event 2",
      timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "audit-2",
      message: "Branding asset updated for Summit Athletic Association",
      timestamp: new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "audit-3",
      message: "Feature flag EXPERIMENTAL_UI toggled off",
      timestamp: new Date(now.getTime() - 16 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "audit-4",
      message: "Morgan Lee requested the Summit Showcase event",
      timestamp: new Date(now.getTime() - 50 * 60 * 1000).toISOString(),
    },
    {
      id: "audit-5",
      message: "Dana Morales generated 12 sample teams for preview deck",
      timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ] satisfies DemoAuditLog[],

  notifications: [
    {
      id: "notif-1",
      summary: "System health check: database, edge cache, and realtime services operational.",
      timestamp: new Date(now.getTime() - 30 * 60 * 1000).toISOString(),
    },
    {
      id: "notif-2",
      summary: "3 new officials completed onboarding this week.",
      timestamp: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "notif-3",
      summary: "Waitlist signups increased 18% after latest campaign.",
      timestamp: new Date(now.getTime() - 28 * 60 * 60 * 1000).toISOString(),
    },
  ] satisfies DemoNotification[],
};
