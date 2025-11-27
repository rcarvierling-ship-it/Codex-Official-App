import "server-only";
import { sql } from "@/lib/db";

export type TeamStanding = {
  teamId: string;
  teamName: string;
  wins: number;
  losses: number;
  ties: number;
  pointsFor: number;
  pointsAgainst: number;
  winPercentage: number;
  rank: number;
};

export type GameResult = {
  id: string;
  eventId: string;
  teamHomeId: string;
  teamAwayId: string;
  homeScore: string | null;
  awayScore: string | null;
  status: string;
  recordedBy: string | null;
  recordedAt: string | null;
  verifiedBy: string | null;
  verifiedAt: string | null;
  isLocked: boolean;
  lockedBy: string | null;
  lockedAt: string | null;
};

/**
 * Get all game results for a division (league + sport + level combination)
 */
export async function getGameResults(
  leagueId?: string,
  sport?: string,
  level?: string
): Promise<GameResult[]> {
  try {
    let query;
    
    if (leagueId && sport && level) {
      // Filter by league, sport, and level
      query = sql<{
        id: string;
        event_id: string;
        team_home_id: string;
        team_away_id: string;
        home_score: string | null;
        away_score: string | null;
        status: string;
        recorded_by: string | null;
        recorded_at: string | Date | null;
        verified_by: string | null;
        verified_at: string | Date | null;
        is_locked: boolean;
        locked_by: string | null;
        locked_at: string | Date | null;
      }>`
        SELECT gr.id, gr.event_id, gr.team_home_id, gr.team_away_id, 
               gr.home_score, gr.away_score, gr.status, 
               gr.recorded_by, gr.recorded_at,
               gr.verified_by, gr.verified_at,
               gr.is_locked, gr.locked_by, gr.locked_at
        FROM game_results gr
        INNER JOIN events e ON e.id = gr.event_id
        WHERE e.league_id = ${leagueId}
          AND e.sport = ${sport}
          AND e.level = ${level}
          AND gr.status = 'COMPLETED'
          AND gr.is_locked = TRUE
        ORDER BY gr.recorded_at DESC
      `;
    } else if (leagueId && sport) {
      // Filter by league and sport
      query = sql<{
        id: string;
        event_id: string;
        team_home_id: string;
        team_away_id: string;
        home_score: string | null;
        away_score: string | null;
        status: string;
        recorded_by: string | null;
        recorded_at: string | Date | null;
        verified_by: string | null;
        verified_at: string | Date | null;
        is_locked: boolean;
        locked_by: string | null;
        locked_at: string | Date | null;
      }>`
        SELECT gr.id, gr.event_id, gr.team_home_id, gr.team_away_id, 
               gr.home_score, gr.away_score, gr.status, 
               gr.recorded_by, gr.recorded_at,
               gr.verified_by, gr.verified_at,
               gr.is_locked, gr.locked_by, gr.locked_at
        FROM game_results gr
        INNER JOIN events e ON e.id = gr.event_id
        WHERE e.league_id = ${leagueId}
          AND e.sport = ${sport}
          AND gr.status = 'COMPLETED'
          AND gr.is_locked = TRUE
        ORDER BY gr.recorded_at DESC
      `;
    } else if (leagueId) {
      // Filter by league only
      query = sql<{
        id: string;
        event_id: string;
        team_home_id: string;
        team_away_id: string;
        home_score: string | null;
        away_score: string | null;
        status: string;
        recorded_by: string | null;
        recorded_at: string | Date | null;
        verified_by: string | null;
        verified_at: string | Date | null;
        is_locked: boolean;
        locked_by: string | null;
        locked_at: string | Date | null;
      }>`
        SELECT gr.id, gr.event_id, gr.team_home_id, gr.team_away_id, 
               gr.home_score, gr.away_score, gr.status, 
               gr.recorded_by, gr.recorded_at,
               gr.verified_by, gr.verified_at,
               gr.is_locked, gr.locked_by, gr.locked_at
        FROM game_results gr
        INNER JOIN events e ON e.id = gr.event_id
        WHERE e.league_id = ${leagueId}
          AND gr.status = 'COMPLETED'
          AND gr.is_locked = TRUE
        ORDER BY gr.recorded_at DESC
      `;
    } else {
      // Get all completed results
      query = sql<{
        id: string;
        event_id: string;
        team_home_id: string;
        team_away_id: string;
        home_score: string | null;
        away_score: string | null;
        status: string;
        recorded_by: string | null;
        recorded_at: string | Date | null;
        verified_by: string | null;
        verified_at: string | Date | null;
        is_locked: boolean;
        locked_by: string | null;
        locked_at: string | Date | null;
      }>`
        SELECT id, event_id, team_home_id, team_away_id, 
               home_score, away_score, status, 
               recorded_by, recorded_at,
               verified_by, verified_at,
               is_locked, locked_by, locked_at
        FROM game_results
        WHERE status = 'COMPLETED'
          AND is_locked = TRUE
        ORDER BY recorded_at DESC
      `;
    }

    const { rows } = await query;

    return rows.map((r) => ({
      id: String(r.id),
      eventId: String(r.event_id),
      teamHomeId: String(r.team_home_id),
      teamAwayId: String(r.team_away_id),
      homeScore: r.home_score,
      awayScore: r.away_score,
      status: r.status,
      recordedBy: r.recorded_by ? String(r.recorded_by) : null,
      recordedAt: r.recorded_at
        ? r.recorded_at instanceof Date
          ? r.recorded_at.toISOString()
          : String(r.recorded_at)
        : null,
      verifiedBy: r.verified_by ? String(r.verified_by) : null,
      verifiedAt: r.verified_at
        ? r.verified_at instanceof Date
          ? r.verified_at.toISOString()
          : String(r.verified_at)
        : null,
      isLocked: Boolean(r.is_locked),
      lockedBy: r.locked_by ? String(r.locked_by) : null,
      lockedAt: r.locked_at
        ? r.locked_at instanceof Date
          ? r.locked_at.toISOString()
          : String(r.locked_at)
        : null,
    }));
  } catch (error) {
    console.error("[standings] getGameResults failed", error);
    return [];
  }
}

/**
 * Calculate standings for teams in a division
 */
export async function calculateStandings(
  leagueId?: string,
  sport?: string,
  level?: string
): Promise<TeamStanding[]> {
  try {
    const results = await getGameResults(leagueId, sport, level);

    // Get all teams in the division
    let teamsQuery;
    if (leagueId && sport && level) {
      teamsQuery = sql<{ id: string; name: string }>`
        SELECT DISTINCT t.id, t.name
        FROM teams t
        INNER JOIN events e ON (e.team_home_id = t.id OR e.team_away_id = t.id)
        WHERE e.league_id = ${leagueId}
          AND e.sport = ${sport}
          AND e.level = ${level}
        ORDER BY t.name ASC
      `;
    } else if (leagueId && sport) {
      teamsQuery = sql<{ id: string; name: string }>`
        SELECT DISTINCT t.id, t.name
        FROM teams t
        INNER JOIN events e ON (e.team_home_id = t.id OR e.team_away_id = t.id)
        WHERE e.league_id = ${leagueId}
          AND e.sport = ${sport}
        ORDER BY t.name ASC
      `;
    } else if (leagueId) {
      teamsQuery = sql<{ id: string; name: string }>`
        SELECT DISTINCT t.id, t.name
        FROM teams t
        INNER JOIN events e ON (e.team_home_id = t.id OR e.team_away_id = t.id)
        WHERE e.league_id = ${leagueId}
        ORDER BY t.name ASC
      `;
    } else {
      // Get all teams that have played games
      teamsQuery = sql<{ id: string; name: string }>`
        SELECT DISTINCT t.id, t.name
        FROM teams t
        INNER JOIN game_results gr ON (gr.team_home_id = t.id OR gr.team_away_id = t.id)
        ORDER BY t.name ASC
      `;
    }

    const { rows: teamRows } = await teamsQuery;
    const teams = teamRows.map((r) => ({
      id: String(r.id),
      name: String(r.name),
    }));

    // Initialize standings for each team
    const standingsMap = new Map<string, TeamStanding>();
    teams.forEach((team) => {
      standingsMap.set(team.id, {
        teamId: team.id,
        teamName: team.name,
        wins: 0,
        losses: 0,
        ties: 0,
        pointsFor: 0,
        pointsAgainst: 0,
        winPercentage: 0,
        rank: 0,
      });
    });

    // Process each game result
    results.forEach((result) => {
      const homeScore = result.homeScore ? parseFloat(result.homeScore) : 0;
      const awayScore = result.awayScore ? parseFloat(result.awayScore) : 0;

      const homeStanding = standingsMap.get(result.teamHomeId);
      const awayStanding = standingsMap.get(result.teamAwayId);

      if (homeStanding) {
        homeStanding.pointsFor += homeScore;
        homeStanding.pointsAgainst += awayScore;
      }

      if (awayStanding) {
        awayStanding.pointsFor += awayScore;
        awayStanding.pointsAgainst += homeScore;
      }

      // Determine winner/loser/tie
      if (homeScore > awayScore) {
        if (homeStanding) homeStanding.wins += 1;
        if (awayStanding) awayStanding.losses += 1;
      } else if (awayScore > homeScore) {
        if (awayStanding) awayStanding.wins += 1;
        if (homeStanding) homeStanding.losses += 1;
      } else {
        // Tie
        if (homeStanding) homeStanding.ties += 1;
        if (awayStanding) awayStanding.ties += 1;
      }
    });

    // Calculate win percentage and sort
    const standings = Array.from(standingsMap.values()).map((standing) => {
      const totalGames = standing.wins + standing.losses + standing.ties;
      standing.winPercentage =
        totalGames > 0 ? (standing.wins + standing.ties * 0.5) / totalGames : 0;
      return standing;
    });

    // Sort by: win percentage (desc), wins (desc), points for (desc), points against (asc)
    standings.sort((a, b) => {
      if (b.winPercentage !== a.winPercentage) {
        return b.winPercentage - a.winPercentage;
      }
      if (b.wins !== a.wins) {
        return b.wins - a.wins;
      }
      if (b.pointsFor !== a.pointsFor) {
        return b.pointsFor - a.pointsFor;
      }
      return a.pointsAgainst - b.pointsAgainst;
    });

    // Assign ranks
    standings.forEach((standing, index) => {
      standing.rank = index + 1;
    });

    return standings;
  } catch (error) {
    console.error("[standings] calculateStandings failed", error);
    return [];
  }
}

/**
 * Get standings for a specific team
 */
export async function getTeamStanding(
  teamId: string,
  leagueId?: string,
  sport?: string,
  level?: string
): Promise<TeamStanding | null> {
  try {
    const standings = await calculateStandings(leagueId, sport, level);
    return standings.find((s) => s.teamId === teamId) || null;
  } catch (error) {
    console.error("[standings] getTeamStanding failed", error);
    return null;
  }
}

/**
 * Create or update a game result
 */
export async function upsertGameResult(
  eventId: string,
  teamHomeId: string,
  teamAwayId: string,
  homeScore: string | null,
  awayScore: string | null,
  status: string,
  recordedBy?: string
): Promise<string> {
  try {
    // Check if result already exists
    const { rows: existing } = await sql<{ id: string }>`
      SELECT id FROM game_results WHERE event_id = ${eventId} LIMIT 1
    `;

    if (existing.length > 0) {
      // Update existing
      await sql`
        UPDATE game_results
        SET team_home_id = ${teamHomeId},
            team_away_id = ${teamAwayId},
            home_score = ${homeScore},
            away_score = ${awayScore},
            status = ${status},
            recorded_by = ${recordedBy || null},
            recorded_at = ${status === "COMPLETED" ? sql`now()` : null},
            updated_at = now()
        WHERE event_id = ${eventId}
      `;
      return existing[0].id;
    } else {
      // Insert new
      const { rows } = await sql<{ id: string }>`
        INSERT INTO game_results (
          event_id, team_home_id, team_away_id, home_score, away_score, 
          status, recorded_by, recorded_at, created_at, updated_at
        )
        VALUES (
          ${eventId}, ${teamHomeId}, ${teamAwayId}, ${homeScore}, ${awayScore},
          ${status}, ${recordedBy || null}, 
          ${status === "COMPLETED" ? sql`now()` : null}, now(), now()
        )
        RETURNING id
      `;
      return rows[0]?.id as string;
    }
  } catch (error) {
    console.error("[standings] upsertGameResult failed", error);
    throw new Error("Failed to save game result");
  }
}

/**
 * Verify a game result (for coaches)
 */
export async function verifyGameResult(
  eventId: string,
  verifiedBy: string
): Promise<void> {
  try {
    // Check if result exists and is not locked
    const { rows: existing } = await sql<{ id: string; is_locked: boolean }>`
      SELECT id, is_locked FROM game_results WHERE event_id = ${eventId} LIMIT 1
    `;

    if (existing.length === 0) {
      throw new Error("Game result not found");
    }

    if (existing[0].is_locked) {
      throw new Error("Cannot verify locked game result.");
    }

    await sql`
      UPDATE game_results
      SET verified_by = ${verifiedBy},
          verified_at = now(),
          updated_at = now()
      WHERE event_id = ${eventId}
    `;
  } catch (error) {
    console.error("[standings] verifyGameResult failed", error);
    throw new Error("Failed to verify game result");
  }
}

/**
 * Lock/finalize a game result (for league admins)
 */
export async function lockGameResult(
  eventId: string,
  lockedBy: string
): Promise<void> {
  try {
    // Check if result exists
    const { rows: existing } = await sql<{ id: string }>`
      SELECT id FROM game_results WHERE event_id = ${eventId} LIMIT 1
    `;

    if (existing.length === 0) {
      throw new Error("Game result not found");
    }

    await sql`
      UPDATE game_results
      SET is_locked = TRUE,
          locked_by = ${lockedBy},
          locked_at = now(),
          updated_at = now()
      WHERE event_id = ${eventId}
    `;
  } catch (error) {
    console.error("[standings] lockGameResult failed", error);
    throw new Error("Failed to lock game result");
  }
}

/**
 * Unlock a game result (for league admins)
 */
export async function unlockGameResult(eventId: string): Promise<void> {
  try {
    await sql`
      UPDATE game_results
      SET is_locked = FALSE,
          locked_by = NULL,
          locked_at = NULL,
          updated_at = now()
      WHERE event_id = ${eventId}
    `;
  } catch (error) {
    console.error("[standings] unlockGameResult failed", error);
    throw new Error("Failed to unlock game result");
  }
}

/**
 * Get game result for a specific event
 */
export async function getGameResultByEventId(eventId: string): Promise<GameResult | null> {
  try {
    const { rows } = await sql<{
      id: string;
      event_id: string;
      team_home_id: string;
      team_away_id: string;
      home_score: string | null;
      away_score: string | null;
      status: string;
      recorded_by: string | null;
      recorded_at: string | Date | null;
      verified_by: string | null;
      verified_at: string | Date | null;
      is_locked: boolean;
      locked_by: string | null;
      locked_at: string | Date | null;
    }>`
      SELECT id, event_id, team_home_id, team_away_id, 
             home_score, away_score, status, 
             recorded_by, recorded_at,
             verified_by, verified_at,
             is_locked, locked_by, locked_at
      FROM game_results
      WHERE event_id = ${eventId}
      LIMIT 1
    `;

    if (rows.length === 0) {
      return null;
    }

    const r = rows[0];
    return {
      id: String(r.id),
      eventId: String(r.event_id),
      teamHomeId: String(r.team_home_id),
      teamAwayId: String(r.team_away_id),
      homeScore: r.home_score,
      awayScore: r.away_score,
      status: r.status,
      recordedBy: r.recorded_by ? String(r.recorded_by) : null,
      recordedAt: r.recorded_at
        ? r.recorded_at instanceof Date
          ? r.recorded_at.toISOString()
          : String(r.recorded_at)
        : null,
      verifiedBy: r.verified_by ? String(r.verified_by) : null,
      verifiedAt: r.verified_at
        ? r.verified_at instanceof Date
          ? r.verified_at.toISOString()
          : String(r.verified_at)
        : null,
      isLocked: Boolean(r.is_locked),
      lockedBy: r.locked_by ? String(r.locked_by) : null,
      lockedAt: r.locked_at
        ? r.locked_at instanceof Date
          ? r.locked_at.toISOString()
          : String(r.locked_at)
        : null,
    };
  } catch (error) {
    console.error("[standings] getGameResultByEventId failed", error);
    return null;
  }
}

