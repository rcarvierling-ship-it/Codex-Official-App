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

import type { SessionUser } from "@/lib/types/auth";

export default async function DashboardPage() {
  const session = await requireAuth();
  const role = await getAuthRole();
  const user = session.user as SessionUser;
  const activeSchoolId = user?.schoolId ?? null;

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
}
