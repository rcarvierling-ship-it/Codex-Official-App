import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";

import { hasDbEnv } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  try {
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
      })
      .from(events)
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
