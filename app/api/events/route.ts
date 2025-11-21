import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";

import { hasDbEnv } from "@/lib/db";
import { getSessionServer } from "@/lib/auth";
import { getUserSchool } from "@/lib/repos/schools";
import { buildAccessScope } from "@/lib/scope";
import { AccessDeniedError } from "@/lib/scopeErrors";
import { withScope } from "@/middleware/scope";

export const runtime = "nodejs";

export async function GET() {
  try {
    const session = await getSessionServer();
    if (!session?.user?.email) {
      return NextResponse.json({ events: [] }, { status: 401 });
    }

    const membership = await getUserSchool(session.user.email);
    if (!membership?.schoolId) {
      return NextResponse.json({ events: [] }, { status: 403 });
    }

    if (!hasDbEnv) {
      return NextResponse.json({ events: [] });
    }
    const { db } = await import("@/server/db/client");
    const { events } = await import("@/server/db/schema");
    const scope = buildAccessScope(session.user, {
      schoolId: membership.schoolId,
      school: membership.school,
      leagueId: membership.school?.leagueId,
    });

    const baseQuery = db
      .select({
        id: events.id,
        sport: events.sport,
        level: events.level,
        startTs: events.startTs,
        venueId: events.venueId,
        teamHomeId: events.teamHomeId,
        teamAwayId: events.teamAwayId,
        schoolId: events.schoolId,
        leagueId: events.leagueId,
      })
      .from(events);

    const scopedQuery = withScope(scope, baseQuery, events);
    const rows = await scopedQuery.orderBy(desc(events.startTs)).limit(50);

    return NextResponse.json({ events: rows });
  } catch (error) {
    if (error instanceof AccessDeniedError) {
      return NextResponse.json({ events: [], message: error.message }, { status: 403 });
    }
    console.warn("[api/events] fallback to empty list", error);
    return NextResponse.json(
      { events: [], message: "Unable to fetch events right now." },
      { status: 200 },
    );
  }
}
