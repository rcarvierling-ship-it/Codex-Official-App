'use server';

import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";

import { db } from "@/server/db/client";
import { events } from "@/server/db/schema";

export const runtime = "nodejs";

export async function GET() {
  try {
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
