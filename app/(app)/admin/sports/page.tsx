import { requireRole } from "@/lib/auth-helpers";
import { getEvents } from "@/lib/repos/events";
import { sql } from "@/lib/db";
import { MultiSportDashboard } from "@/components/sports/MultiSportDashboard";
import { format } from "date-fns";

export const metadata = { title: "Multi-Sport Dashboard" };
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Sport = "volleyball" | "basketball" | "football" | "soccer" | "baseball" | "softball" | "track";

async function getTeamsBySport() {
  try {
    const { rows } = await sql<{
      id: string;
      name: string;
      sport: string;
      level: string | null;
      school_id: string | null;
    }>`
      SELECT id, name, sport, level, school_id
      FROM teams
      WHERE sport IS NOT NULL
      ORDER BY sport, name ASC
    `;
    return rows.map((r) => ({
      id: String(r.id),
      name: String(r.name),
      sport: String(r.sport).toLowerCase() as Sport,
      level: r.level ? String(r.level) : null,
      schoolId: r.school_id ? String(r.school_id) : null,
    }));
  } catch (error) {
    console.error("Failed to fetch teams:", error);
    return [];
  }
}

async function getEventsBySport() {
  try {
    const { rows } = await sql<{
      id: string;
      name: string;
      start_ts: string | Date | null;
      sport: string | null;
      status: string | null;
    }>`
      SELECT id, 
             COALESCE(notes, 'Game') as name,
             start_ts,
             sport,
             'SCHEDULED' as status
      FROM events
      WHERE sport IS NOT NULL
      ORDER BY start_ts DESC
    `;
    return rows.map((r) => ({
      id: String(r.id),
      name: String(r.name),
      startsAt: r.start_ts
        ? r.start_ts instanceof Date
          ? r.start_ts.toISOString()
          : String(r.start_ts)
        : new Date().toISOString(),
      sport: r.sport ? (String(r.sport).toLowerCase() as Sport) : null,
      status: r.status ? String(r.status) : "SCHEDULED",
    }));
  } catch (error) {
    console.error("Failed to fetch events:", error);
    return [];
  }
}

async function getGameResultsBySport() {
  try {
    const { rows } = await sql<{
      event_id: string;
      home_score: string | null;
      away_score: string | null;
      status: string;
    }>`
      SELECT gr.event_id, gr.home_score, gr.away_score, gr.status
      FROM game_results gr
      INNER JOIN events e ON e.id = gr.event_id
      WHERE gr.status = 'COMPLETED' AND gr.is_locked = TRUE
    `;
    return rows.map((r) => ({
      eventId: String(r.event_id),
      homeScore: r.home_score ? String(r.home_score) : null,
      awayScore: r.away_score ? String(r.away_score) : null,
      status: String(r.status),
    }));
  } catch (error) {
    console.error("Failed to fetch game results:", error);
    return [];
  }
}

export default async function MultiSportDashboardPage() {
  await requireRole("league_admin");

  const [teams, events, gameResults] = await Promise.all([
    getTeamsBySport(),
    getEventsBySport(),
    getGameResultsBySport(),
  ]);

  // Group data by sport
  const sportsData: Record<Sport, any> = {
    volleyball: { sport: "volleyball", teams: [], events: [], stats: { totalTeams: 0, upcomingGames: 0, completedGames: 0 } },
    basketball: { sport: "basketball", teams: [], events: [], stats: { totalTeams: 0, upcomingGames: 0, completedGames: 0 } },
    football: { sport: "football", teams: [], events: [], stats: { totalTeams: 0, upcomingGames: 0, completedGames: 0 } },
    soccer: { sport: "soccer", teams: [], events: [], stats: { totalTeams: 0, upcomingGames: 0, completedGames: 0 } },
    baseball: { sport: "baseball", teams: [], events: [], stats: { totalTeams: 0, upcomingGames: 0, completedGames: 0 } },
    softball: { sport: "softball", teams: [], events: [], stats: { totalTeams: 0, upcomingGames: 0, completedGames: 0 } },
    track: { sport: "track", teams: [], events: [], stats: { totalTeams: 0, upcomingGames: 0, completedGames: 0 } },
  };

  // Map teams to sports
  teams.forEach((team) => {
    const sport = team.sport;
    if (sport && sportsData[sport]) {
      sportsData[sport].teams.push({
        id: team.id,
        name: team.name,
        level: team.level,
      });
      sportsData[sport].stats.totalTeams++;
    }
  });

  // Map events to sports and calculate stats
  const now = new Date();
  events.forEach((event) => {
    if (!event.sport) return;
    const sport = event.sport;
    if (sportsData[sport]) {
      const eventDate = new Date(event.startsAt);
      sportsData[sport].events.push({
        id: event.id,
        name: event.name,
        startsAt: event.startsAt,
        status: event.status,
      });

      if (eventDate > now) {
        sportsData[sport].stats.upcomingGames++;
      } else {
        sportsData[sport].stats.completedGames++;
      }
    }
  });

  // Calculate win-loss records for teams with game results
  const gameResultsMap = new Map(gameResults.map((gr) => [gr.eventId, gr]));
  Object.values(sportsData).forEach((sportData) => {
    // This would need team-event mapping to calculate records
    // For now, we'll leave it as optional
  });

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Multi-Sport Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          View and manage all sports in one place. Each sport has custom fields and views.
        </p>
      </header>

      <MultiSportDashboard sportsData={sportsData} />
    </div>
  );
}

