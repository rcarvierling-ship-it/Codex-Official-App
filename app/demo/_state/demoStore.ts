'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import {
  DemoAssignment,
  DemoAuditLog,
  DemoEvent,
  DemoFeatureFlags,
  DemoRequest,
  DemoRole,
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
  const newEntry: DemoAuditLog = {
    id: `log_${Math.random().toString(36).slice(2, 10)}`,
    timestamp: nowISO(),
    ...entry,
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

  // UI/session
  currentUserId: string | null;
  selectedSchoolId: string | null;

  // Actions
  switchUser: (userId: string) => void;
  setSelectedSchool: (schoolId: string | null) => void;

  setFeatureFlags: (flags: Partial<DemoFeatureFlags>) => void;

  upsertEvent: (event: DemoEvent) => void;

  submitRequest: (payload: {
    eventId: string;
    userId: string;
    message?: string;
  }) => void;

  updateRequestStatus: (opts: {
    id: string;
    nextStatus: string; // accept raw string from UI/API and normalize it
    actorUserId: string;
    note?: string;
  }) => void;

  addAssignment: (assignment: DemoAssignment) => void;

  resetDemo: () => void;
};

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

      currentUserId: mockData.users[0]?.id ?? null,
      selectedSchoolId: mockData.events[0]?.schoolId ?? null,

      /* --------------------------------- Actions -------------------------------- */

      switchUser: (userId) => {
        const state = get();
        // keep selectedSchoolId if the new user still has access; otherwise clear
        const canSeeSelected =
          !!state.selectedSchoolId &&
          state.users.some(
            (u) => u.id === userId && u.schoolIds?.includes(state.selectedSchoolId!)
          );

        set({
          currentUserId: userId,
          selectedSchoolId: canSeeSelected ? state.selectedSchoolId : null,
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
            details: JSON.stringify({ id: event.id, name: event.name }),
          }),
        });
      },

      submitRequest: ({ eventId, userId, message }) => {
        const state = get();

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
            details: JSON.stringify({ id: newReq.id, eventId }),
          }),
        });
      },

      updateRequestStatus: ({ id, nextStatus, actorUserId, note }) => {
        const state = get();

        const normalized: RequestStatus = normalizeStatus(nextStatus);

        // Build a correctly typed array; status stays within the union
        const updatedRequests: DemoRequest[] = state.requests.map((r) =>
          r.id === id ? { ...r, status: normalized } : r
        );

        // If approving, you might create an assignment stub here (demo behavior)
        let newAssignments = state.assignments;
        if (normalized === 'APPROVED') {
          const req = state.requests.find((r) => r.id === id);
          if (req) {
            const assignment: DemoAssignment = {
              id: `asn_${Math.random().toString(36).slice(2, 10)}`,
              eventId: req.eventId,
              userId: req.userId,
              role: 'OFFICIAL',
              createdAt: nowISO(),
              status: 'ASSIGNED',
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
            details: JSON.stringify({ id, note }),
          }),
        });
      },

      addAssignment: (assignment) => {
        const state = get();
        set({
          assignments: [assignment, ...state.assignments],
          activity: addActivity(state.activity, {
            actorUserId: state.currentUserId ?? 'system',
            type: 'ASSIGNMENT_ADDED',
            details: JSON.stringify({
              id: assignment.id,
              eventId: assignment.eventId,
              userId: assignment.userId,
            }),
          }),
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
          currentUserId: mockData.users[0]?.id ?? null,
          selectedSchoolId: mockData.events[0]?.schoolId ?? null,
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
        currentUserId: state.currentUserId,
        selectedSchoolId: state.selectedSchoolId,
      }),
    }
  )
);
