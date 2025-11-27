import { Metadata } from "next";
import { StandingsPageClient } from "./StandingsPageClient";
import { calculateStandings } from "@/lib/repos/standings";
import { sql } from "@/lib/db";

export const metadata: Metadata = {
  title: "Standings & Leaderboards | The Official App",
  description: "View current standings, wins, losses, and statistics for all divisions and teams.",
  openGraph: {
    title: "Standings & Leaderboards | The Official App",
    description: "View current standings, wins, losses, and statistics for all divisions and teams.",
  },
};

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type League = {
  id: string;
  name: string;
  slug: string;
};

type Division = {
  leagueId: string;
  leagueName: string;
  sport: string;
  level: string;
};

async function getLeagues(): Promise<League[]> {
  try {
    const { rows } = await sql<Record<string, unknown>>`
      SELECT id, name, slug FROM leagues ORDER BY name ASC
    `;
    return rows.map((r) => ({
      id: String(r.id),
      name: String(r.name),
      slug: String(r.slug),
    }));
  } catch (error) {
    console.error("Failed to fetch leagues:", error);
    return [];
  }
}

async function getDivisions(): Promise<Division[]> {
  try {
    const { rows } = await sql<{
      league_id: string;
      league_name: string;
      sport: string;
      level: string;
    }>`
      SELECT DISTINCT 
        e.league_id,
        l.name as league_name,
        e.sport,
        e.level
      FROM events e
      INNER JOIN leagues l ON l.id = e.league_id
      WHERE e.league_id IS NOT NULL
        AND e.sport IS NOT NULL
        AND e.level IS NOT NULL
      ORDER BY l.name ASC, e.sport ASC, e.level ASC
    `;
    return rows.map((r) => ({
      leagueId: String(r.league_id),
      leagueName: String(r.league_name),
      sport: String(r.sport),
      level: String(r.level),
    }));
  } catch (error) {
    console.error("Failed to fetch divisions:", error);
    return [];
  }
}

export default async function StandingsPage() {
  const [leagues, divisions] = await Promise.all([getLeagues(), getDivisions()]);

  // Get standings for each division
  const divisionsWithStandings = await Promise.all(
    divisions.map(async (division) => {
      const standings = await calculateStandings(
        division.leagueId,
        division.sport,
        division.level
      );
      return {
        ...division,
        standings,
      };
    })
  );

  return (
    <StandingsPageClient
      leagues={leagues}
      divisions={divisionsWithStandings}
    />
  );
}

