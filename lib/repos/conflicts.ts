import "server-only";
import { sql } from "@/lib/db";

export type Conflict = {
  type: "VENUE_DOUBLE_BOOK" | "COACH_DOUBLE_BOOK" | "REFEREE_TOO_CLOSE" | "TEAM_BACK_TO_BACK";
  severity: "ERROR" | "WARNING";
  message: string;
  eventId1: string;
  eventId2: string;
  event1Name: string;
  event2Name: string;
  event1Start: string;
  event2Start: string;
  details?: Record<string, unknown>;
};

/**
 * Check for venue double-booking conflicts
 */
export async function checkVenueConflicts(
  venueId: string,
  startTime: string,
  endTime: string | null,
  excludeEventId?: string
): Promise<Conflict[]> {
  try {
    const conflicts: Conflict[] = [];
    
    // Get events at the same venue with overlapping times
    const { rows } = await sql<{
      id: string;
      notes: string | null;
      start_ts: string | Date;
      end_ts: string | Date | null;
    }>`
      SELECT id, notes, start_ts, end_ts
      FROM events
      WHERE venue_id = ${venueId}
        AND id != COALESCE(${excludeEventId || null}, '00000000-0000-0000-0000-000000000000'::uuid)
        AND (
          (start_ts >= ${startTime}::timestamp AND start_ts < COALESCE(${endTime}::timestamp, ${startTime}::timestamp + interval '2 hours'))
          OR (COALESCE(end_ts, start_ts + interval '2 hours') > ${startTime}::timestamp AND COALESCE(end_ts, start_ts + interval '2 hours') <= COALESCE(${endTime}::timestamp, ${startTime}::timestamp + interval '2 hours'))
          OR (start_ts <= ${startTime}::timestamp AND COALESCE(end_ts, start_ts + interval '2 hours') >= COALESCE(${endTime}::timestamp, ${startTime}::timestamp + interval '2 hours'))
        )
      ORDER BY start_ts ASC
    `;

    rows.forEach((row) => {
      conflicts.push({
        type: "VENUE_DOUBLE_BOOK",
        severity: "ERROR",
        message: `Venue is already booked for another event at this time`,
        eventId1: excludeEventId || "",
        eventId2: String(row.id),
        event1Name: "New Event",
        event2Name: row.notes || "Event",
        event1Start: startTime,
        event2Start: row.start_ts instanceof Date ? row.start_ts.toISOString() : String(row.start_ts),
        details: {
          venueId,
          conflictingEventId: String(row.id),
        },
      });
    });

    return conflicts;
  } catch (error) {
    console.error("[conflicts] checkVenueConflicts failed", error);
    return [];
  }
}

/**
 * Check for coach double-booking conflicts
 * A coach assigned to multiple teams playing at the same time
 */
export async function checkCoachConflicts(
  coachUserId: string,
  teamId: string,
  startTime: string,
  endTime: string | null,
  excludeEventId?: string
): Promise<Conflict[]> {
  try {
    const conflicts: Conflict[] = [];

    // Find events where the coach's other teams are playing at the same time
    const { rows } = await sql<{
      event_id: string;
      team_id: string;
      team_name: string;
      event_name: string | null;
      start_ts: string | Date;
      end_ts: string | Date | null;
    }>`
      SELECT 
        e.id as event_id,
        t.id as team_id,
        t.name as team_name,
        COALESCE(e.notes, 'Event') as event_name,
        e.start_ts,
        e.end_ts
      FROM events e
      INNER JOIN teams t ON (t.id = e.team_home_id OR t.id = e.team_away_id)
      INNER JOIN user_school_roles usr ON usr.school_id = t.school_id
      WHERE usr.user_id = ${coachUserId}
        AND usr.role = 'COACH'
        AND t.id != ${teamId}
        AND e.id != COALESCE(${excludeEventId || null}, '00000000-0000-0000-0000-000000000000'::uuid)
        AND e.start_ts IS NOT NULL
        AND (
          (e.start_ts >= ${startTime}::timestamp AND e.start_ts < COALESCE(${endTime}::timestamp, ${startTime}::timestamp + interval '2 hours'))
          OR (COALESCE(e.end_ts, e.start_ts + interval '2 hours') > ${startTime}::timestamp AND COALESCE(e.end_ts, e.start_ts + interval '2 hours') <= COALESCE(${endTime}::timestamp, ${startTime}::timestamp + interval '2 hours'))
          OR (e.start_ts <= ${startTime}::timestamp AND COALESCE(e.end_ts, e.start_ts + interval '2 hours') >= COALESCE(${endTime}::timestamp, ${startTime}::timestamp + interval '2 hours'))
        )
      ORDER BY e.start_ts ASC
    `;

    rows.forEach((row) => {
      conflicts.push({
        type: "COACH_DOUBLE_BOOK",
        severity: "ERROR",
        message: `Coach is already assigned to another team playing at this time`,
        eventId1: excludeEventId || "",
        eventId2: String(row.event_id),
        event1Name: "New Event",
        event2Name: row.event_name || `${row.team_name} Game`,
        event1Start: startTime,
        event2Start: row.start_ts instanceof Date ? row.start_ts.toISOString() : String(row.start_ts),
        details: {
          coachUserId,
          conflictingTeamId: String(row.team_id),
          conflictingTeamName: row.team_name,
        },
      });
    });

    return conflicts;
  } catch (error) {
    console.error("[conflicts] checkCoachConflicts failed", error);
    return [];
  }
}

/**
 * Check for referee conflicts - games too close together
 * Referees need travel time between games
 */
export async function checkRefereeConflicts(
  refereeUserId: string,
  startTime: string,
  endTime: string | null,
  venueId: string | null,
  excludeEventId?: string,
  minTravelMinutes: number = 30
): Promise<Conflict[]> {
  try {
    const conflicts: Conflict[] = [];

    // Get referee's other assignments
    const { rows } = await sql<{
      event_id: string;
      event_name: string | null;
      start_ts: string | Date;
      end_ts: string | Date | null;
      venue_id: string | null;
      venue_name: string | null;
    }>`
      SELECT 
        e.id as event_id,
        COALESCE(e.notes, 'Event') as event_name,
        e.start_ts,
        e.end_ts,
        e.venue_id,
        v.name as venue_name
      FROM events e
      LEFT JOIN venues v ON v.id = e.venue_id
      INNER JOIN assignments a ON a.event_id = e.id
      WHERE a.user_id = ${refereeUserId}
        AND a.assign_role = 'OFFICIAL'
        AND e.id != COALESCE(${excludeEventId || null}, '00000000-0000-0000-0000-000000000000'::uuid)
        AND e.start_ts IS NOT NULL
        AND (
          -- New game starts too soon after previous game ends
          (e.start_ts < ${startTime}::timestamp AND COALESCE(e.end_ts, e.start_ts + interval '2 hours') > ${startTime}::timestamp - interval '${minTravelMinutes} minutes')
          -- New game ends too soon before next game starts
          OR (e.start_ts > ${startTime}::timestamp AND e.start_ts < COALESCE(${endTime}::timestamp, ${startTime}::timestamp + interval '2 hours') + interval '${minTravelMinutes} minutes')
        )
      ORDER BY e.start_ts ASC
    `;

    rows.forEach((row) => {
      const rowEndTime = row.end_ts instanceof Date ? row.end_ts : new Date(row.start_ts instanceof Date ? row.start_ts.getTime() + 2 * 60 * 60 * 1000 : new Date(row.start_ts).getTime() + 2 * 60 * 60 * 1000);
      const newStartTime = new Date(startTime);
      const timeBetween = Math.abs(newStartTime.getTime() - rowEndTime.getTime()) / (1000 * 60); // minutes

      conflicts.push({
        type: "REFEREE_TOO_CLOSE",
        severity: timeBetween < minTravelMinutes ? "ERROR" : "WARNING",
        message: `Referee has another game ${Math.round(timeBetween)} minutes ${newStartTime > rowEndTime ? "before" : "after"} this one (minimum ${minTravelMinutes} minutes required)`,
        eventId1: excludeEventId || "",
        eventId2: String(row.event_id),
        event1Name: "New Event",
        event2Name: row.event_name || "Event",
        event1Start: startTime,
        event2Start: row.start_ts instanceof Date ? row.start_ts.toISOString() : String(row.start_ts),
        details: {
          refereeUserId,
          timeBetweenMinutes: Math.round(timeBetween),
          minTravelMinutes,
          previousVenue: row.venue_name,
        },
      });
    });

    return conflicts;
  } catch (error) {
    console.error("[conflicts] checkRefereeConflicts failed", error);
    return [];
  }
}

/**
 * Check for team back-to-back conflicts
 * Teams playing games too close together
 */
export async function checkTeamBackToBackConflicts(
  teamId: string,
  startTime: string,
  endTime: string | null,
  excludeEventId?: string,
  minRestHours: number = 2
): Promise<Conflict[]> {
  try {
    const conflicts: Conflict[] = [];

    // Find other games for this team
    const { rows } = await sql<{
      event_id: string;
      event_name: string | null;
      start_ts: string | Date;
      end_ts: string | Date | null;
    }>`
      SELECT 
        e.id as event_id,
        COALESCE(e.notes, 'Event') as event_name,
        e.start_ts,
        e.end_ts
      FROM events e
      WHERE (e.team_home_id = ${teamId} OR e.team_away_id = ${teamId})
        AND e.id != COALESCE(${excludeEventId || null}, '00000000-0000-0000-0000-000000000000'::uuid)
        AND e.start_ts IS NOT NULL
        AND (
          -- Previous game ends too close to new game start
          (e.start_ts < ${startTime}::timestamp AND COALESCE(e.end_ts, e.start_ts + interval '2 hours') > ${startTime}::timestamp - interval '${minRestHours} hours')
          -- New game ends too close to next game start
          OR (e.start_ts > ${startTime}::timestamp AND e.start_ts < COALESCE(${endTime}::timestamp, ${startTime}::timestamp + interval '2 hours') + interval '${minRestHours} hours')
        )
      ORDER BY e.start_ts ASC
    `;

    rows.forEach((row) => {
      const rowEndTime = row.end_ts instanceof Date ? row.end_ts : new Date(row.start_ts instanceof Date ? row.start_ts.getTime() + 2 * 60 * 60 * 1000 : new Date(row.start_ts).getTime() + 2 * 60 * 60 * 1000);
      const newStartTime = new Date(startTime);
      const hoursBetween = Math.abs(newStartTime.getTime() - rowEndTime.getTime()) / (1000 * 60 * 60);

      conflicts.push({
        type: "TEAM_BACK_TO_BACK",
        severity: hoursBetween < minRestHours ? "ERROR" : "WARNING",
        message: `Team has another game ${hoursBetween.toFixed(1)} hours ${newStartTime > rowEndTime ? "before" : "after"} this one (minimum ${minRestHours} hours rest recommended)`,
        eventId1: excludeEventId || "",
        eventId2: String(row.event_id),
        event1Name: "New Event",
        event2Name: row.event_name || "Event",
        event1Start: startTime,
        event2Start: row.start_ts instanceof Date ? row.start_ts.toISOString() : String(row.start_ts),
        details: {
          teamId,
          hoursBetween: parseFloat(hoursBetween.toFixed(1)),
          minRestHours,
        },
      });
    });

    return conflicts;
  } catch (error) {
    console.error("[conflicts] checkTeamBackToBackConflicts failed", error);
    return [];
  }
}

/**
 * Check all conflicts for an event
 */
export async function checkAllConflicts(params: {
  eventId?: string;
  venueId?: string | null;
  teamHomeId?: string | null;
  teamAwayId?: string | null;
  startTime: string;
  endTime?: string | null;
  assignedReferees?: string[];
  coachUserIds?: string[];
}): Promise<Conflict[]> {
  const conflicts: Conflict[] = [];

  // Check venue conflicts
  if (params.venueId) {
    const venueConflicts = await checkVenueConflicts(
      params.venueId,
      params.startTime,
      params.endTime || null,
      params.eventId
    );
    conflicts.push(...venueConflicts);
  }

  // Check team back-to-back conflicts
  if (params.teamHomeId) {
    const teamConflicts = await checkTeamBackToBackConflicts(
      params.teamHomeId,
      params.startTime,
      params.endTime || null,
      params.eventId
    );
    conflicts.push(...teamConflicts);
  }

  if (params.teamAwayId) {
    const teamConflicts = await checkTeamBackToBackConflicts(
      params.teamAwayId,
      params.startTime,
      params.endTime || null,
      params.eventId
    );
    conflicts.push(...teamConflicts);
  }

  // Check referee conflicts
  if (params.assignedReferees && params.assignedReferees.length > 0) {
    for (const refereeId of params.assignedReferees) {
      const refereeConflicts = await checkRefereeConflicts(
        refereeId,
        params.startTime,
        params.endTime || null,
        params.venueId || null,
        params.eventId
      );
      conflicts.push(...refereeConflicts);
    }
  }

  // Check coach conflicts
  if (params.coachUserIds && params.coachUserIds.length > 0) {
    for (const coachId of params.coachUserIds) {
      // Check for home team coach conflicts
      if (params.teamHomeId) {
        const coachConflicts = await checkCoachConflicts(
          coachId,
          params.teamHomeId,
          params.startTime,
          params.endTime || null,
          params.eventId
        );
        conflicts.push(...coachConflicts);
      }
      // Check for away team coach conflicts
      if (params.teamAwayId) {
        const coachConflicts = await checkCoachConflicts(
          coachId,
          params.teamAwayId,
          params.startTime,
          params.endTime || null,
          params.eventId
        );
        conflicts.push(...coachConflicts);
      }
    }
  }

  return conflicts;
}

/**
 * Get all conflicts for existing events
 */
export async function getAllConflicts(): Promise<Conflict[]> {
  try {
    const allConflicts: Conflict[] = [];

    // Get all events
    const { rows: events } = await sql<{
      id: string;
      venue_id: string | null;
      team_home_id: string | null;
      team_away_id: string | null;
      start_ts: string | Date;
      end_ts: string | Date | null;
      notes: string | null;
    }>`
      SELECT id, venue_id, team_home_id, team_away_id, start_ts, end_ts, COALESCE(notes, 'Event') as notes
      FROM events
      WHERE start_ts IS NOT NULL
      ORDER BY start_ts ASC
    `;

    // Check each event for conflicts
    for (const event of events) {
      const startTime = event.start_ts instanceof Date ? event.start_ts.toISOString() : String(event.start_ts);
      const endTime = event.end_ts ? (event.end_ts instanceof Date ? event.end_ts.toISOString() : String(event.end_ts)) : null;

      // Get assigned referees
      const { rows: assignments } = await sql<{ user_id: string }>`
        SELECT user_id
        FROM assignments
        WHERE event_id = ${event.id} AND assign_role = 'OFFICIAL'
      `;
      const refereeIds = assignments.map((a) => String(a.user_id));

      // Get coach user IDs for teams
      const coachUserIds: string[] = [];
      if (event.team_home_id) {
        const { rows: homeCoaches } = await sql<{ user_id: string }>`
          SELECT usr.user_id
          FROM user_school_roles usr
          INNER JOIN teams t ON t.school_id = usr.school_id
          WHERE t.id = ${event.team_home_id} AND usr.role = 'COACH'
        `;
        coachUserIds.push(...homeCoaches.map((c) => String(c.user_id)));
      }
      if (event.team_away_id) {
        const { rows: awayCoaches } = await sql<{ user_id: string }>`
          SELECT usr.user_id
          FROM user_school_roles usr
          INNER JOIN teams t ON t.school_id = usr.school_id
          WHERE t.id = ${event.team_away_id} AND usr.role = 'COACH'
        `;
        coachUserIds.push(...awayCoaches.map((c) => String(c.user_id)));
      }

      const conflicts = await checkAllConflicts({
        eventId: String(event.id),
        venueId: event.venue_id ? String(event.venue_id) : null,
        teamHomeId: event.team_home_id ? String(event.team_home_id) : null,
        teamAwayId: event.team_away_id ? String(event.team_away_id) : null,
        startTime,
        endTime: endTime || undefined,
        assignedReferees: refereeIds,
        coachUserIds: Array.from(new Set(coachUserIds)),
      });

      allConflicts.push(...conflicts);
    }

    return allConflicts;
  } catch (error) {
    console.error("[conflicts] getAllConflicts failed", error);
    return [];
  }
}

