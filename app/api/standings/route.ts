import { NextResponse } from "next/server";
import { calculateStandings } from "@/lib/repos/standings";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const leagueId = searchParams.get("leagueId") || undefined;
    const sport = searchParams.get("sport") || undefined;
    const level = searchParams.get("level") || undefined;

    const standings = await calculateStandings(leagueId, sport, level);

    return NextResponse.json({ standings });
  } catch (error: any) {
    console.error("[api/standings] GET error:", error);
    return NextResponse.json(
      { message: error?.message || "Failed to fetch standings." },
      { status: 500 }
    );
  }
}

