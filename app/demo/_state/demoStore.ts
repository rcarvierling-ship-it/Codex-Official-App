'use client';

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import {
  DemoAssignment,
  DemoAuditLog,
  DemoEvent,
  DemoFeatureFlags,
  DemoRequest,
  DemoRole,
  DemoUser,
  mockData,
} from "../_data/mockData";

export const personaOptions = [
  {
    label: "League Admin",
    userId: "user-superadmin",
    summary:
      "Oversees league-wide operations and unlocks every control surface.",
    highlights: [
      "Launch seasons across multiple schools",
      "Approve budgets, staffing, and workflows",
      "Roll out new feature flags to programs",
    ],
  },
  {
    label: "School Admin",
    userId: "user-school-admin",
    summary: "Manages school schedules, teams, and coordinator workflows.",
    highlights: [
      "Publish schedules and manage venues",
      "Invite officials and assign staff",
      "Review approvals from coaches and ADs",
    ],
  },
  {
    label: "Athletic Director",
    userId: "user-ad",
    summary:
      "Reviews requests, confirms officials, and communicates with crews.",
    highlights: [
      "Approve or decline staffing requests",
      "Monitor assignment coverage",
      "Send updates to teams and officials",
    ],
  },
  {
    label: "Coach",
    userId: "user-coach",
    summary: "Keeps rosters, events, and communications aligned for teams.",
    highlights: [
      "Track schedules and roster availability",
      "Submit staffing requests for upcoming events",
      "Receive official confirmations in real time",
    ],
  },
  {
    label: "Official",
    userId: "user-official-1",
    summary: "Requests assignments and confirms availability on the go.",
    highlights: [
      "Request to work marquee events",
      "Update travel windows and certifications",
      "Track assignments and payouts",
    ],
  },
  {
    label: "Viewer",
    userId: "user-viewer",
    summary: "Observes schedules and dashboards without edit permissions.",
    highlights: [
      "Monitor upcoming events and alerts",
      "Follow assignment changes in real time",
      "Review activity feeds and analytics",
    ],
  },
] as const;

export type PersonaLabel = (typeof personaOptions)[number]["label"];

type DemoState = {
  leagues: typeof mockData.leagues;
  schools: typeof mockData.schools;
  teams: typeof mockData.teams;
  venues: typeof mockData.venues;
  users: typeof mockData.users;
  events: typeof mockData.events;
  requests: typeof mockData.requests;
  assignments: typeof mockData.assignments;
  announcements: typeof mockData.announcements;
  waitlist: typeof mockData.waitlist;
  notifications: typeof mockData.notifications;
  featureFlags: DemoFeatureFlags;
  activity: DemoAuditLog[];
  branding: { logoDataUrl?: string };
  rateLimits: { burst: number; sustained: number };
  notesByEvent: Record<string, string>;
  activeUserId: string;
  currentRole: DemoRole;
  currentPersona: PersonaLabel;
  requestToWork: (eventId: string) => void;
  approveRequest: (requestId: string) => void;
  declineRequest: (requestId: string) => void;
  approveRequests: (requestIds: string[]) => void;
  declineRequests: (requestIds: string[]) => void;
  toggleFlag: (key: keyof DemoFeatureFlags) => void;
  generateSample: (count: number) => void;
  wipeStore: () => void;
  reseed: () => void;
  setBranding: (logoDataUrl?: string) => void;
  setRateLimits: (limits: { burst: number; sustained: number }) => void;
  updateNotes: (eventId: string, notes: string) => void;
  setPersona: (persona: PersonaLabel) => void;
  setRole: (role: DemoRole) => void;
  logAction: (message: string) => void;
  updateUserRole: (userId: string, role: DemoRole) => void;
};

const generateId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `demo-${Math.random().toString(36).slice(2, 10)}`;
};

const addActivity = (
  activity: DemoAuditLog[],
  message: string,
): DemoAuditLog[] => {
  const entry: DemoAuditLog = {
    id: generateId(),
    message,
    timestamp: new Date().toISOString(),
  };

  return [entry, ...activity].slice(0, 40);
};

const initialPersona = personaOptions[0];
const initialUser =
  mockData.users.find((user) => user.id === initialPersona.userId) ??
  mockData.users[0];

const getUserById = (users: DemoUser[], id: string) =>
  users.find((user) => user.id === id);

export const useDemoStore = create<DemoState>()(
  persist(
    (set, get) => ({
      leagues: mockData.leagues,
      schools: mockData.schools,
      teams: mockData.teams,
      venues: mockData.venues,
      users: mockData.users,
      events: mockData.events,
      requests: mockData.requests,
      assignments: mockData.assignments,
      announcements: mockData.announcements,
      waitlist: mockData.waitlist,
      notifications: mockData.notifications,
      featureFlags: mockData.featureFlags,
      activity: mockData.auditLogs,
      branding: {},
      rateLimits: { burst: 180, sustained: 1200 },
      notesByEvent: {},
      activeUserId: initialUser.id,
      currentRole: initialUser.role,
      currentPersona: initialPersona.label,
      requestToWork: (eventId) => {
        const state = get();
        if (state.currentRole !== "OFFICIAL") {
          set({
            activity: addActivity(
              state.activity,
              "Tried to request work, but this persona cannot request assignments.",
            ),
          });
          return;
        }

        const user = getUserById(state.users, state.activeUserId);
        const event = state.events.find((e) => e.id === eventId);
        if (!user || !event) return;

        const alreadyRequested = state.requests.some(
          (req) =>
            req.eventId === eventId &&
            req.userId === user.id &&
            req.status === "PENDING",
        );

        if (alreadyRequested) {
          set({
            activity: addActivity(
              state.activity,
              `${user.name} already has a pending request for ${event.title}.`,
            ),
          });
          return;
        }

        const newRequest: DemoRequest = {
          id: generateId(),
          eventId,
          userId: user.id,
          status: "PENDING",
          submittedAt: new Date().toISOString(),
          message: "Ready to work – added via interactive demo.",
        };

        set({
          requests: [newRequest, ...state.requests],
          activity: addActivity(
            state.activity,
            `${user.name} requested to work ${event.title}.`,
          ),
        });
      },
      approveRequest: (requestId) => {
        const state = get();
        if (!["SUPER_ADMIN", "ADMIN", "AD"].includes(state.currentRole)) {
          set({
            activity: addActivity(
              state.activity,
              "Approval blocked — this persona does not have permission.",
            ),
          });
          return;
        }

        const request = state.requests.find((r) => r.id === requestId);
        if (!request) return;

        const event = state.events.find((e) => e.id === request.eventId);
        const user = getUserById(state.users, request.userId);
        const approver = getUserById(state.users, state.activeUserId);
        if (!event || !user || !approver) return;

        const updatedRequests = state.requests.map((req) =>
          req.id === requestId ? { ...req, status: "APPROVED" } : req,
        );

        const assignment: DemoAssignment = {
          id: generateId(),
          eventId: request.eventId,
          userId: request.userId,
          position: `${event.sport} Official`,
          confirmedAt: new Date().toISOString(),
        };

        set({
          requests: updatedRequests,
          assignments: [assignment, ...state.assignments],
          activity: addActivity(
            state.activity,
            `${approver.name} approved ${user.name} for ${event.title}.`,
          ),
        });
      },
      declineRequest: (requestId) => {
        const state = get();
        if (!["SUPER_ADMIN", "ADMIN", "AD"].includes(state.currentRole)) {
          set({
            activity: addActivity(
              state.activity,
              "Decline blocked — this persona does not have permission.",
            ),
          });
          return;
        }

        const request = state.requests.find((r) => r.id === requestId);
        if (!request) return;

        const user = getUserById(state.users, request.userId);
        const event = state.events.find((e) => e.id === request.eventId);
        const approver = getUserById(state.users, state.activeUserId);
        if (!user || !event || !approver) return;

        set({
          requests: state.requests.map((req) =>
            req.id === requestId ? { ...req, status: "DECLINED" } : req,
          ),
          activity: addActivity(
            state.activity,
            `${approver.name} declined ${user.name} for ${event.title}.`,
          ),
        });
      },
      approveRequests: (requestIds) => {
        const { approveRequest } = get();
        requestIds.forEach((id) => {
          approveRequest(id);
        });
      },
      declineRequests: (requestIds) => {
        const { declineRequest } = get();
        requestIds.forEach((id) => {
          declineRequest(id);
        });
      },
      toggleFlag: (key) => {
        const state = get();
        set({
          featureFlags: {
            ...state.featureFlags,
            [key]: !state.featureFlags[key],
          },
          activity: addActivity(
            state.activity,
            `${state.featureFlags[key] ? "Disabled" : "Enabled"} feature flag ${key}.`,
          ),
        });
      },
      generateSample: (count) => {
        const state = get();
        const createdEvents: DemoEvent[] = [];
        const createdSchools: typeof state.schools = [];
        const createdTeams: typeof state.teams = [];
        const now = Date.now();

        for (let i = 0; i < count; i += 1) {
          const league = state.leagues[i % state.leagues.length] ?? state.leagues[0];
          const venue = state.venues[i % state.venues.length] ?? state.venues[0];
          const schoolId = generateId();
          const teamId = generateId();
          const opponent = state.teams[(i + 1) % state.teams.length];

          createdSchools.push({
            id: schoolId,
            leagueId: league.id,
            name: `Sample Prep ${i + 1}`,
            mascot: ["Falcons", "Chargers", "Titans", "Hawks"][i % 4],
            city: ["Asheville", "Madison", "Fairview", "Brighton"][i % 4],
            state: ["NC", "WI", "OH", "MI"][i % 4],
          });

          createdTeams.push({
            id: teamId,
            schoolId,
            name: `Sample Prep ${i + 1} ${["Lions", "Storm", "Ravens", "Bears"][i % 4]}`,
            sport: opponent?.sport ?? "Basketball",
            level: opponent?.level ?? "Varsity",
            record: `${10 + i}-${i}`,
          });

          createdEvents.push({
            id: generateId(),
            title: `${createdTeams[i]?.name ?? "Sample"} vs ${opponent?.name ?? "Opponent"}`,
            leagueId: league.id,
            schoolId,
            homeTeamId: teamId,
            awayTeamId: opponent?.id ?? state.teams[0]?.id ?? teamId,
            venueId: venue.id,
            sport: createdTeams[i]?.sport ?? "Basketball",
            level: createdTeams[i]?.level ?? "Varsity",
            start: new Date(now + (i + 1) * 3_600_000).toISOString(),
            end: new Date(now + (i + 1.5) * 3_600_000).toISOString(),
            status: "Scheduled",
            notes: "Generated via demo tools.",
            createdBy: state.activeUserId,
          });
        }

        set({
          schools: [...createdSchools, ...state.schools],
          teams: [...createdTeams, ...state.teams],
          events: [...createdEvents, ...state.events],
          activity: addActivity(
            state.activity,
            `Generated ${count} sample schools, teams, and events for quick demos.`,
          ),
        });
      },
      wipeStore: () => {
        const state = get();
        set({
          events: [],
          requests: [],
          assignments: [],
          announcements: [],
          waitlist: [],
          activity: addActivity([], "Cleared demo data via dev tools."),
        });
      },
      reseed: () => {
        set({
          leagues: mockData.leagues,
          schools: mockData.schools,
          teams: mockData.teams,
          venues: mockData.venues,
          users: mockData.users,
          events: mockData.events,
          requests: mockData.requests,
          assignments: mockData.assignments,
          announcements: mockData.announcements,
          waitlist: mockData.waitlist,
          notifications: mockData.notifications,
          activity: addActivity(mockData.auditLogs, "Reseeded demo store to defaults."),
        });
      },
      setBranding: (logoDataUrl) => {
        const state = get();
        set({
          branding: { logoDataUrl },
          activity: addActivity(
            state.activity,
            logoDataUrl
              ? "Updated brand logo for the dashboard."
              : "Cleared custom branding.",
          ),
        });
      },
      setRateLimits: (limits) => {
        const state = get();
        set({
          rateLimits: limits,
          activity: addActivity(
            state.activity,
            `Adjusted rate limits to burst ${limits.burst}/min and sustained ${limits.sustained}/hr.`,
          ),
        });
      },
      updateNotes: (eventId, notes) => {
        const state = get();
        set({
          notesByEvent: {
            ...state.notesByEvent,
            [eventId]: notes,
          },
        });
      },
      setPersona: (personaLabel) => {
        const state = get();
        const persona = personaOptions.find(
          (option) => option.label === personaLabel,
        );
        if (!persona) return;
        const user = getUserById(state.users, persona.userId);
        if (!user) return;

        set({
          currentPersona: persona.label,
          activeUserId: persona.userId,
          currentRole: user.role,
          activity: addActivity(
            state.activity,
            `Switched persona to ${persona.label}.`,
          ),
        });
      },
      setRole: (role) => {
        const state = get();
        set({
          currentRole: role,
          activity: addActivity(
            state.activity,
            `Switched role context to ${role}.`,
          ),
        });
      },
      logAction: (message) => {
        const state = get();
        set({
          activity: addActivity(state.activity, message),
        });
      },
      updateUserRole: (userId, role) => {
        const state = get();
        const actor = getUserById(state.users, state.activeUserId);
        if (!actor || actor.role !== "SUPER_ADMIN") return;

        set({
          users: state.users.map((user) =>
            user.id === userId ? { ...user, role } : user,
          ),
          activity: addActivity(
            state.activity,
            `${actor.name} changed ${
              state.users.find((u) => u.id === userId)?.name ?? "user"
            } to role ${role}.`,
          ),
        });
      },
    }),
    {
      name: "theofficialapp-demo-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        featureFlags: state.featureFlags,
        branding: state.branding,
        rateLimits: state.rateLimits,
        notesByEvent: state.notesByEvent,
        activeUserId: state.activeUserId,
        currentRole: state.currentRole,
        currentPersona: state.currentPersona,
      }),
    },
  ),
);
