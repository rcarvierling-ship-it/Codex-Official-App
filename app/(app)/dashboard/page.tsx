import { redirect } from "next/navigation";
import { getAuthRole, requireAuth } from "@/lib/auth-helpers";
import { getEvents } from "@/lib/repos/events";
import { getRequests } from "@/lib/repos/requests";
import { getAssignments } from "@/lib/repos/assignments";
import { getUsers } from "@/lib/repos/users";
import { getGameChangeRequests } from "@/lib/repos/game-change-requests";
import { getSchoolById } from "@/lib/repos/schools";
import { sql } from "@/lib/db";
import { DashboardClient } from "./DashboardClient";
import { CoachDashboardClient } from "./CoachDashboardClient";

export const metadata = { title: "Dashboard" };
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function getTeams(schoolIds: string[]) {
  try {
    if (schoolIds.length === 0) return [];
    const { rows } = await sql<{ id: string; name: string; sport: string | null; level: string | null; school_id: string | null }>`
      SELECT id, name, sport, level, school_id
      FROM teams
      WHERE school_id = ANY(${schoolIds})
      ORDER BY name ASC
    `;
    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      sport: r.sport,
      level: r.level,
      schoolId: r.school_id,
    }));
  } catch {
    return [];
  }
}

export default async function DashboardPage() {
  const session = await requireAuth();
  const role = await getAuthRole();
  const activeSchoolId = (session.user as any)?.schoolId ?? null;

  // Get school branding
  let schoolBranding: {
    name: string;
    logoUrl: string | null;
    mascotName: string | null;
    mascotImageUrl: string | null;
    primaryColor: string | null;
    secondaryColor: string | null;
  } | null = null;
  if (activeSchoolId) {
    try {
      const school = await getSchoolById(activeSchoolId);
      if (school) {
        schoolBranding = {
          name: school.name,
          logoUrl: school.logoUrl ?? null,
          mascotName: school.mascotName ?? null,
          mascotImageUrl: school.mascotImageUrl ?? null,
          primaryColor: school.primaryColor ?? null,
          secondaryColor: school.secondaryColor ?? null,
        };
      }
    } catch (error) {
      console.error("Failed to fetch school branding:", error);
    }
  }

  // Redirect based on role to appropriate dashboard
  const { getRoleDashboardPath } = await import("@/lib/onboarding-redirect");
  const dashboardPath = getRoleDashboardPath(role);
  redirect(dashboardPath);

  const user = session.user as any;
  const currentUserId = user?.id;
  const canSeeAll = user?.canSeeAll ?? false;
  const accessibleSchools = user?.accessibleSchools ?? [];
  const accessibleLeagues = user?.accessibleLeagues ?? [];

  const filterBy = canSeeAll
    ? null
    : { schoolIds: accessibleSchools, leagueIds: accessibleLeagues };

  const [events, requests, assignments, users, teams] = await Promise.all([
    getEvents(filterBy),
    getRequests(),
    getAssignments(),
    getUsers(),
    getTeams(accessibleSchools),
  ]);

  const eventMap = new Map(events.map((e) => [e.id, e]));
  const userMap = new Map(users.map((u) => [u.id, u]));

  // For COACH, show comprehensive coach dashboard
  if (role === "coach") {
    // Get upcoming events (next 30 days)
    const now = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const upcomingEvents = events
      .filter((e) => {
        const eventDate = new Date(e.startsAt);
        return eventDate >= now && eventDate <= thirtyDaysFromNow;
      })
      .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime())
      .slice(0, 12);

    // Get requests and assignments for coach's events
    const eventIds = new Set(upcomingEvents.map((e) => e.id));
    const eventRequests = requests
      .filter((r) => eventIds.has(r.eventId))
      .map((r) => ({
        ...r,
        event: eventMap.get(r.eventId),
        user: userMap.get(r.userId),
      }));

    const eventAssignments = assignments
      .filter((a) => eventIds.has(a.eventId))
      .map((a) => ({
        ...a,
        event: eventMap.get(a.eventId),
        user: userMap.get(a.userId),
      }))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Get coach's teams
    const myTeams = teams;

    // Get coach's change requests
    const myChangeRequests = await getGameChangeRequests({ requestedBy: currentUserId });

    return (
      <CoachDashboardClient
        data={{
          upcomingEvents,
          myTeams,
          eventRequests,
          eventAssignments,
          changeRequests: myChangeRequests.map((cr) => ({
            id: cr.id,
            eventId: cr.eventId,
            changeType: cr.changeType,
            currentValue: cr.currentValue,
            requestedValue: cr.requestedValue,
            reason: cr.reason,
            status: cr.status,
            createdAt: cr.createdAt,
            event: cr.event,
          })),
          stats: {
            totalUpcomingEvents: upcomingEvents.length,
            totalTeams: myTeams.length,
            pendingRequests: eventRequests.filter((r) => r.status === "PENDING").length,
            confirmedAssignments: eventAssignments.filter((a) => a.status === "ASSIGNED").length,
            pendingChangeRequests: myChangeRequests.filter((cr) => cr.status === "PENDING").length,
          },
          branding: schoolBranding,
        }}
      />
    );
  }

  // For USER, show a simple dashboard
  const requestsForSchool = requests.filter((request) => eventMap.has(request.eventId));
  const assignmentsForSchool = assignments.filter((assignment) => eventMap.has(assignment.eventId));
  const usersForSchool = canSeeAll
    ? users
    : users.filter((user) =>
        Array.isArray(user.schoolIds) && user.schoolIds.length > 0
          ? user.schoolIds.some((id) => accessibleSchools.includes(id))
          : false
      );

  const pendingRequests = requestsForSchool.filter((r) => r.status === "PENDING");
  const myAssignments = assignmentsForSchool.filter((a) => a.status === "ASSIGNED");
  const officials = usersForSchool.filter((u) => u.role === "official").length;

  return (
    <DashboardClient
      data={{
        events: events.map(e => ({
          id: e.id,
          name: e.name,
          startsAt: e.startsAt,
        })),
        pendingRequests: pendingRequests.map(r => ({
          id: r.id,
          status: r.status,
          submittedAt: r.submittedAt || new Date().toISOString(),
        })),
        myAssignments: myAssignments.length,
        officials,
        branding: schoolBranding,
      }}
    />
  );
}
