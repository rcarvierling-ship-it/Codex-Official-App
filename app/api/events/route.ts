import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";

import { hasDbEnv } from "@/lib/db";
import { getSessionServer } from "@/lib/auth";
import { getUserSchool } from "@/lib/repos/schools";

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
    const rows = await db
      .select({
        id: events.id,
        sport: events.sport,
        level: events.level,
        startTs: events.startTs,
        venueId: events.venueId,
        teamHomeId: events.teamHomeId,
        teamAwayId: events.teamAwayId,
        schoolId: events.schoolId,
      })
      .from(events)
      .where(eq(events.schoolId, membership.schoolId))
      .orderBy(desc(events.startTs))
      .limit(50);

    return NextResponse.json({ events: rows });
  } catch (error) {
    console.warn("[api/events] fallback to empty list", error);
    return NextResponse.json(
      { events: [], message: "Unable to fetch events right now." },
      { status: 200 },
    );
  }
}
