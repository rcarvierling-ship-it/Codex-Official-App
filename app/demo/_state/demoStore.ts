'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import {
  DemoAnnouncement,
  DemoAssignment,
  DemoAuditLog,
  DemoEvent,
  DemoFeatureFlags,
  DemoLeague,
  DemoPlayer,
  DemoRequest,
  DemoRole,
  DemoSchool,
  DemoTeam,
  DemoUser,
  mockData,
} from '../_data/mockData';

/**
 * Persona presets shown in the demo header/switcher
 */
export const personaOptions = [
  {
    label: 'League Admin',
    userId: 'user-superadmin',
    summary:
      'Oversees league-wide operations and unlocks every control surface.',
    highlights: [
      'Launch seasons across multiple schools',
      'Approve budgets, staffing, and workflows',
      'Roll out new feature flags to programs',
    ],
  },
  {
    label: 'School Admin',
    userId: 'user-school-admin',
    summary: 'Manages school schedules, teams, and coordinator workflows.',
    highlights: [
      'Publish schedules and manage venues',
      'Invite officials and assign staff',
      'Review approvals from coaches and ADs',
    ],
  },
  {
    label: 'Athletic Director',
    userId: 'user-ad',
    summary: 'Reviews, approves, and escalates requests across a program.',
    highlights: [
      'Approve or decline event requests',
      'Manage teams and budget approvals',
      'Coordinate with league administrators',
    ],
  },
  {
    label: 'Coach',
    userId: 'user-coach',
    summary: 'Submits game requests and manages team rosters.',
    highlights: [
      'Request new games and scrimmages',
      'Upload rosters and manage lineups',
      'Coordinate with ADs and officials',
    ],
  },
  {
    label: 'Official',
    userId: 'user-official',
    summary: 'Claims assignments and reports results.',
    highlights: [
      'Claim or decline assignments',
      'Report game outcomes',
      'Track payments and certifications',
    ],
  },
] as const;

/* --------------------------------- Helpers -------------------------------- */

type RequestStatus = DemoRequest['status']; // "PENDING" | "APPROVED" | "DECLINED" (from types)

/**
 * Normalize any incoming string to a valid DemoRequest status.
 * Keeps types narrow so updated arrays infer as DemoRequest[] (not widening to string).
 */
const normalizeStatus = (s: string): RequestStatus => {
  const u = s.toUpperCase();
  if (u === 'APPROVED' || u === 'DECLINED' || u === 'PENDING') return u;
  return 'PENDING';
};

const nowISO = () => new Date().toISOString();

const addActivity = (
  activity: DemoAuditLog[],
  entry: Omit<DemoAuditLog, 'id' | 'timestamp'>
): DemoAuditLog[] => {
  const describe = (): string => {
    if (entry.message) return entry.message;
    switch (entry.type) {
      case 'FEATURE_FLAGS_UPDATED':
        return 'Feature flags updated';
      case 'EVENT_CREATED':
        return 'New event created';
      case 'EVENT_UPDATED':
        return 'Event updated';
      case 'REQUEST_SUBMITTED':
        return 'New request submitted';
      case 'REQUEST_APPROVED':
        return 'Request approved';
      case 'REQUEST_DECLINED':
        return 'Request declined';
      case 'REQUEST_MARKED_PENDING':
        return 'Request marked pending';
      case 'ASSIGNMENT_ADDED':
        return 'Assignment added';
      case 'USER_ROLE_UPDATED':
        return 'User role updated';
      case 'SAMPLE_DATA_GENERATED':
        return 'Sample data generated';
      case 'ROSTER_UPDATED':
        return 'Roster updated';
      case 'LEAGUE_CREATED':
        return 'League created';
      case 'BRANDING_UPDATED':
        return 'Branding updated';
      default:
        return entry.details || 'Demo activity logged';
    }
  };

  const newEntry: DemoAuditLog = {
    id: `log_${Math.random().toString(36).slice(2, 10)}`,
    timestamp: nowISO(),
    ...entry,
    message: describe(),
  };
  return [newEntry, ...activity];
};

/* --------------------------------- Store ---------------------------------- */

export type DemoStoreState = {
  // Data
  users: DemoUser[];
  roles: DemoRole[];
  events: DemoEvent[];
  requests: DemoRequest[];
  assignments: DemoAssignment[];
  activity: DemoAuditLog[];
  featureFlags: DemoFeatureFlags;
  announcements: DemoAnnouncement[];
  leagues: typeof mockData.leagues;
  schools: typeof mockData.schools;
  teams: typeof mockData.teams;
  venues: typeof mockData.venues;
  rosters: Record<string, DemoPlayer[]>;

  // UI/session
  currentUserId: string | null;
  activeUserId: string | null; // Alias for currentUserId
  selectedSchoolId: string | null;
  currentPersona: string;
  currentRole: DemoRole;
  branding: { logoDataUrl?: string } | undefined;
  rateLimits: { burst: number; sustained: number };

  // Actions
  switchUser: (userId: string) => void;
  setSelectedSchool: (schoolId: string | null) => void;
  setPersona: (personaLabel: string) => void;
  approveRequest: (id: string) => void;
  declineRequest: (id: string) => void;
  approveRequests: (ids: string[]) => void;
  declineRequests: (ids: string[]) => void;

  setFeatureFlags: (flags: Partial<DemoFeatureFlags>) => void;
  toggleFlag: (key: keyof DemoFeatureFlags) => void;
  createLeague: (payload?: Partial<DemoLeague>) => DemoLeague | undefined;

  upsertEvent: (event: DemoEvent) => void;
  updateNotes: (eventId: string, notes: string) => void;

  submitRequest: (payload: {
    eventId: string;
    userId: string;
    message?: string;
  }) => void;
  requestToWork: (eventId: string, message?: string) => void;

  updateRequestStatus: (opts: {
    id: string;
    nextStatus: string; // accept raw string from UI/API and normalize it
    actorUserId: string;
    note?: string;
  }) => void;

  addAssignment: (assignment: DemoAssignment) => void;
  updateUserRole: (userId: string, role: DemoRole) => void;
  addPlayerToTeam: (
    teamId: string,
    player: Omit<DemoPlayer, 'id' | 'teamId'>
  ) => DemoPlayer | undefined;
  removePlayerFromTeam: (teamId: string, playerId: string) => void;

  setBranding: (logoDataUrl: string | undefined) => void;
  setRateLimits: (limits: { burst: number; sustained: number }) => void;

  generateSample: (count: number) => void;
  wipeStore: () => void;
  reseed: () => void;

  resetDemo: () => void;
};

// Helper to get activeUserId (alias for currentUserId)
export const getActiveUserId = (state: DemoStoreState) => state.currentUserId;

export const useDemoStore = create<DemoStoreState>()(
  persist(
    (set, get) => ({
      /* ------------------------------ Initial State ----------------------------- */
      users: mockData.users,
      roles: mockData.roles,
      events: mockData.events,
      requests: mockData.requests,
      assignments: mockData.assignments,
      activity: mockData.activity,
      featureFlags: mockData.featureFlags,
      announcements: mockData.announcements,
      leagues: mockData.leagues,
      schools: mockData.schools,
      teams: mockData.teams,
      venues: mockData.venues,
      rosters: mockData.rosters,

      currentUserId: mockData.users[0]?.id ?? null,
      activeUserId: mockData.users[0]?.id ?? null,
      selectedSchoolId: mockData.events[0]?.schoolId ?? null,
      currentPersona: 'School Admin',
      currentRole: mockData.users[0]?.role ?? 'ADMIN',
      branding: undefined,
      rateLimits: { burst: 120, sustained: 1000 },

      /* --------------------------------- Actions -------------------------------- */

      switchUser: (userId) => {
        const state = get();
        const user = state.users.find(u => u.id === userId);
        if (!user) return;
        
        // keep selectedSchoolId if the new user still has access; otherwise clear
        const canSeeSelected =
          !!state.selectedSchoolId &&
          state.users.some(
            (u) => u.id === userId && u.schoolIds?.includes(state.selectedSchoolId!)
          );

        const roleMap: Record<string, string> = {
          'SUPER_ADMIN': 'League Admin',
          'ADMIN': 'School Admin',
          'AD': 'Athletic Director',
          'COACH': 'Coach',
          'OFFICIAL': 'Official',
        };

        set({
          currentUserId: userId,
          activeUserId: userId,
          selectedSchoolId: canSeeSelected ? state.selectedSchoolId : null,
          currentPersona: roleMap[user.role] || 'School Admin',
          currentRole: user.role,
        });
      },

      setPersona: (personaLabel) => {
        const persona = personaOptions.find(p => p.label === personaLabel);
        if (persona) {
          get().switchUser(persona.userId);
        }
      },

      approveRequest: (id) => {
        const state = get();
        state.updateRequestStatus({
          id,
          nextStatus: 'APPROVED',
          actorUserId: state.currentUserId || 'system',
        });
      },

      declineRequest: (id) => {
        const state = get();
        state.updateRequestStatus({
          id,
          nextStatus: 'DECLINED',
          actorUserId: state.currentUserId || 'system',
        });
      },

      setSelectedSchool: (schoolId) => set({ selectedSchoolId: schoolId }),

      setFeatureFlags: (flags) => {
        const state = get();
      set({
        featureFlags: { ...state.featureFlags, ...flags },
        activity: addActivity(state.activity, {
          actorUserId: state.currentUserId ?? 'system',
          type: 'FEATURE_FLAGS_UPDATED',
          message: 'Feature flags updated',
          details: JSON.stringify(flags),
        }),
      });
    },

      upsertEvent: (event) => {
        const state = get();
        const exists = state.events.some((e) => e.id === event.id);
        const nextEvents = exists
          ? state.events.map((e) => (e.id === event.id ? event : e))
          : [event, ...state.events];

      set({
        events: nextEvents,
        activity: addActivity(state.activity, {
          actorUserId: state.currentUserId ?? 'system',
          type: exists ? 'EVENT_UPDATED' : 'EVENT_CREATED',
          message: exists
            ? `Event updated: ${event.title}`
            : `Event created: ${event.title}`,
          details: JSON.stringify({ id: event.id, title: event.title }),
        }),
      });
    },

      submitRequest: ({ eventId, userId, message }) => {
        const state = get();
        const eventTitle =
          state.events.find((event) => event.id === eventId)?.title ??
          'Event';

        const newReq: DemoRequest = {
          id: `req_${Math.random().toString(36).slice(2, 10)}`,
          eventId,
          userId,
          status: 'PENDING',
          submittedAt: nowISO(),
          message,
        };

        set({
          requests: [newReq, ...state.requests],
          activity: addActivity(state.activity, {
            actorUserId: userId,
            type: 'REQUEST_SUBMITTED',
            message: `Request submitted for ${eventTitle}`,
            details: JSON.stringify({ id: newReq.id, eventId }),
          }),
        });
      },

      updateRequestStatus: ({ id, nextStatus, actorUserId, note }) => {
        const state = get();

        const normalized: RequestStatus = normalizeStatus(nextStatus);
        const request = state.requests.find((r) => r.id === id);
        const eventTitle = request
          ? state.events.find((event) => event.id === request.eventId)?.title
          : undefined;

        // Build a correctly typed array; status stays within the union
        const updatedRequests: DemoRequest[] = state.requests.map((r) =>
          r.id === id ? { ...r, status: normalized } : r
        );

        // If approving, you might create an assignment stub here (demo behavior)
        let newAssignments = state.assignments;
        if (normalized === 'APPROVED') {
          if (request) {
            const assignment: DemoAssignment = {
              id: `asn_${Math.random().toString(36).slice(2, 10)}`,
              eventId: request.eventId,
              userId: request.userId,
              position: 'Official',
              confirmedAt: nowISO(),
            };
            newAssignments = [assignment, ...newAssignments];
          }
        }

        set({
          requests: updatedRequests,
          assignments: newAssignments,
          activity: addActivity(state.activity, {
            actorUserId,
            type:
              normalized === 'APPROVED'
                ? 'REQUEST_APPROVED'
                : normalized === 'DECLINED'
                ? 'REQUEST_DECLINED'
                : 'REQUEST_MARKED_PENDING',
            message:
              normalized === 'APPROVED'
                ? `Request approved for ${eventTitle ?? 'an event'}`
                : normalized === 'DECLINED'
                ? `Request declined for ${eventTitle ?? 'an event'}`
                : `Request moved back to pending`,
            details: JSON.stringify({ id, note }),
          }),
        });
      },

      addAssignment: (assignment) => {
        const state = get();
        const eventTitle = state.events.find(
          (event) => event.id === assignment.eventId
        )?.title;
        set({
          assignments: [assignment, ...state.assignments],
          activity: addActivity(state.activity, {
            actorUserId: state.currentUserId ?? 'system',
            type: 'ASSIGNMENT_ADDED',
            message: `Assignment added for ${eventTitle ?? assignment.eventId}`,
            details: JSON.stringify({
              id: assignment.id,
              eventId: assignment.eventId,
              userId: assignment.userId,
            }),
          }),
        });
      },

      approveRequests: (ids) => {
        const state = get();
        ids.forEach((id) => {
          state.updateRequestStatus({
            id,
            nextStatus: 'APPROVED',
            actorUserId: state.currentUserId || 'system',
          });
        });
      },

      declineRequests: (ids) => {
        const state = get();
        ids.forEach((id) => {
          state.updateRequestStatus({
            id,
            nextStatus: 'DECLINED',
            actorUserId: state.currentUserId || 'system',
          });
        });
      },

      toggleFlag: (key) => {
        const state = get();
        state.setFeatureFlags({ [key]: !state.featureFlags[key] });
      },

      updateNotes: (eventId, notes) => {
        const state = get();
        const updatedEvents = state.events.map((e) =>
          e.id === eventId ? { ...e, notes } : e
        );
        set({ events: updatedEvents });
      },

      requestToWork: (eventId, message) => {
        const state = get();
        state.submitRequest({
          eventId,
          userId: state.currentUserId || 'user-official-1',
          message,
        });
      },

      updateUserRole: (userId, role) => {
        const state = get();
        const updatedUsers = state.users.map((u) =>
          u.id === userId ? { ...u, role } : u
        );
        const userName = state.users.find((u) => u.id === userId)?.name;
        set({
          users: updatedUsers,
          activity: addActivity(state.activity, {
            actorUserId: state.currentUserId ?? 'system',
            type: 'USER_ROLE_UPDATED',
            message: `Role updated for ${userName ?? userId}`,
            details: JSON.stringify({ userId, role }),
          }),
        });
      },

      addPlayerToTeam: (teamId, player) => {
        const state = get();
        const roster = state.rosters[teamId] ?? [];
        const teamName =
          state.teams.find((team) => team.id === teamId)?.name ?? 'Team';

        const newPlayer: DemoPlayer = {
          id: `player_${Math.random().toString(36).slice(2, 9)}`,
          teamId,
          ...player,
        };

        set({
          rosters: {
            ...state.rosters,
            [teamId]: [newPlayer, ...roster],
          },
          activity: addActivity(state.activity, {
            actorUserId: state.currentUserId ?? 'system',
            type: 'ROSTER_UPDATED',
            message: `Added ${newPlayer.name} to ${teamName}`,
            details: JSON.stringify({ teamId, playerId: newPlayer.id }),
          }),
        });

        return newPlayer;
      },

      removePlayerFromTeam: (teamId, playerId) => {
        const state = get();
        const roster = state.rosters[teamId] ?? [];
        const remaining = roster.filter((player) => player.id !== playerId);
        const removedPlayer = roster.find((player) => player.id === playerId);
        const teamName =
          state.teams.find((team) => team.id === teamId)?.name ?? 'Team';

        set({
          rosters: {
            ...state.rosters,
            [teamId]: remaining,
          },
          activity: removedPlayer
            ? addActivity(state.activity, {
                actorUserId: state.currentUserId ?? 'system',
                type: 'ROSTER_UPDATED',
                message: `Removed ${removedPlayer.name} from ${teamName}`,
                details: JSON.stringify({ teamId, playerId }),
              })
            : state.activity,
        });
      },

      createLeague: (payload) => {
        const state = get();
        const sequence = state.leagues.length + 1;
        const newLeague: DemoLeague = {
          id: `league-${Math.random().toString(36).slice(2, 8)}`,
          name: payload?.name ?? `New Demo League ${sequence}`,
          region: payload?.region ?? 'Regional',
          contactEmail:
            payload?.contactEmail ??
            `league${sequence}@theofficial.app`,
        };

        set({
          leagues: [newLeague, ...state.leagues],
          activity: addActivity(state.activity, {
            actorUserId: state.currentUserId ?? 'system',
            type: 'LEAGUE_CREATED',
            message: `League created: ${newLeague.name}`,
            details: JSON.stringify(newLeague),
          }),
        });

        return newLeague;
      },

      setBranding: (logoDataUrl) => {
        set((state) => ({
          branding: logoDataUrl ? { logoDataUrl } : undefined,
          activity: logoDataUrl
            ? addActivity(state.activity, {
                actorUserId: state.currentUserId ?? 'system',
                type: 'BRANDING_UPDATED',
                message: 'Branding assets refreshed',
              })
            : state.activity,
        }));
      },

      setRateLimits: (limits) => {
        set({ rateLimits: limits });
      },

      generateSample: (count) => {
        const state = get();
        const newSchools: typeof mockData.schools = [];
        const newTeams: typeof mockData.teams = [];
        const newEvents: DemoEvent[] = [];
        const newRosters: Record<string, DemoPlayer[]> = {};

        for (let i = 0; i < count; i++) {
          const schoolId = `school-sample-${i}`;
          const leagueId = state.leagues[i % state.leagues.length]?.id ?? state.leagues[0]?.id;
          newSchools.push({
            id: schoolId,
            leagueId: leagueId ?? 'league-1',
            name: `Sample School ${i + 1}`,
            mascot: 'Tigers',
            city: 'Sample City',
            state: 'XX',
          });

          const teamId = `team-sample-${i}`;
          newTeams.push({
            id: teamId,
            schoolId,
            name: `Sample Team ${i + 1}`,
            sport: 'Basketball',
            level: 'Varsity',
            record: '0-0',
          });

          const eventId = `event-sample-${i}`;
          newEvents.push({
            id: eventId,
            title: `Sample Event ${i + 1}`,
            leagueId: leagueId ?? 'league-1',
            schoolId,
            homeTeamId: teamId,
            awayTeamId: state.teams[0]?.id ?? 'team-1',
            venueId: state.venues[0]?.id ?? 'venue-1',
            sport: 'Basketball',
            level: 'Varsity',
            start: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString(),
            end: new Date(Date.now() + i * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
            status: 'Scheduled',
            notes: '',
            createdBy: state.currentUserId ?? 'system',
          });

          newRosters[teamId] = [
            {
              id: `player-sample-${i}-1`,
              teamId,
              number: `#${20 + i}`,
              name: `Sample Player ${i + 1}`,
              position: 'Guard',
              classYear: '11th',
            },
            {
              id: `player-sample-${i}-2`,
              teamId,
              number: `#${30 + i}`,
              name: `Sample Player ${i + 6}`,
              position: 'Forward',
              classYear: '12th',
            },
          ];
        }

        set({
          schools: [...state.schools, ...newSchools],
          teams: [...state.teams, ...newTeams],
          events: [...state.events, ...newEvents],
          rosters: { ...state.rosters, ...newRosters },
          activity: addActivity(state.activity, {
            actorUserId: state.currentUserId ?? 'system',
            type: 'SAMPLE_DATA_GENERATED',
            message: `Generated ${count} sample program${count === 1 ? '' : 's'}`,
            details: JSON.stringify({ count }),
          }),
        });
      },

      wipeStore: () => {
        set({
          users: [],
          events: [],
          requests: [],
          assignments: [],
          schools: [],
          teams: [],
          leagues: [],
          venues: [],
          announcements: [],
          activity: [],
          rosters: {},
        });
      },

      reseed: () => {
        set({
          users: mockData.users,
          roles: mockData.roles,
          events: mockData.events,
          requests: mockData.requests,
          assignments: mockData.assignments,
          activity: mockData.activity,
          featureFlags: mockData.featureFlags,
          announcements: mockData.announcements,
          leagues: mockData.leagues,
          schools: mockData.schools,
          teams: mockData.teams,
          venues: mockData.venues,
          rosters: mockData.rosters,
        });
      },

      resetDemo: () =>
        set({
          users: mockData.users,
          roles: mockData.roles,
          events: mockData.events,
          requests: mockData.requests,
          assignments: mockData.assignments,
          activity: mockData.activity,
          featureFlags: mockData.featureFlags,
          announcements: mockData.announcements,
          leagues: mockData.leagues,
          schools: mockData.schools,
          teams: mockData.teams,
          venues: mockData.venues,
          rosters: mockData.rosters,
          currentUserId: mockData.users[0]?.id ?? null,
          activeUserId: mockData.users[0]?.id ?? null,
          selectedSchoolId: mockData.events[0]?.schoolId ?? null,
          currentPersona: 'School Admin',
          currentRole: mockData.users[0]?.role ?? 'ADMIN',
          branding: undefined,
          rateLimits: { burst: 120, sustained: 1000 },
        }),
    }),
    {
      name: 'official-app-demo-store',
      version: 1,
      storage: createJSONStorage(() => sessionStorage),
      // If your mock types change, you can bump version and migrate here.
      // migrate: (persisted, version) => { ...; return migratedState; }
      partialize: (state) => ({
        users: state.users,
        roles: state.roles,
        events: state.events,
        requests: state.requests,
        assignments: state.assignments,
        activity: state.activity,
        featureFlags: state.featureFlags,
        announcements: state.announcements,
        leagues: state.leagues,
        schools: state.schools,
        teams: state.teams,
        venues: state.venues,
        rosters: state.rosters,
        currentUserId: state.currentUserId,
        activeUserId: state.activeUserId,
        selectedSchoolId: state.selectedSchoolId,
        currentPersona: state.currentPersona,
        currentRole: state.currentRole,
        branding: state.branding,
        rateLimits: state.rateLimits,
      }),
    }
  )
);
