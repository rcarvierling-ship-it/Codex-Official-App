import { getEvents } from "@/lib/repos/events";
import { getRequests } from "@/lib/repos/requests";
import { getAssignments } from "@/lib/repos/assignments";
import { getUsers } from "@/lib/repos/users";
import { getGameChangeRequests } from "@/lib/repos/game-change-requests";
import { getGameResultByEventId } from "@/lib/repos/standings";
import { requireAuth, getAuthRole } from "@/lib/auth-helpers";
import { notFound } from "next/navigation";
import { ChatThread } from "@/components/chat/ChatThread";
import { EventDetailClient } from "./EventDetailClient";
import { sql } from "@/lib/db";
import type { SessionUser } from "@/lib/types/auth";

export const metadata = { title: "Event Details" };
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function EventDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await requireAuth();
  const user = session.user as SessionUser;
  const canSeeAll = user.canSeeAll ?? false;
  const accessibleSchools = user.accessibleSchools ?? [];
  const accessibleLeagues = user.accessibleLeagues ?? [];
  const { id } = params;

  const filterBy = canSeeAll
    ? null
    : { schoolIds: accessibleSchools, leagueIds: accessibleLeagues };

  const role = await getAuthRole();
  const currentUserId = user.id || "";

  const [events, requests, assignments, users, changeRequests, gameResult] = await Promise.all([
    getEvents(filterBy),
    getRequests(),
    getAssignments(),
    getUsers(),
    getGameChangeRequests({ eventId: id }),
    getGameResultByEventId(id),
  ]);

  const event = events.find((e) => e.id === id);
  if (!event) {
    notFound();
  }

  // Get team information
  let teamHomeId: string | null = null;
  let teamAwayId: string | null = null;
  let teamHomeName: string = "Home Team";
  let teamAwayName: string = "Away Team";

  try {
    const { rows: eventRows } = await sql<{
      team_home_id: string | null;
      team_away_id: string | null;
    }>`
      SELECT team_home_id, team_away_id
      FROM events
      WHERE id = ${id}
      LIMIT 1
    `;

    if (eventRows.length > 0) {
      teamHomeId = eventRows[0].team_home_id ? String(eventRows[0].team_home_id) : null;
      teamAwayId = eventRows[0].team_away_id ? String(eventRows[0].team_away_id) : null;

      // Get team names
      if (teamHomeId) {
        const { rows: homeTeamRows } = await sql<{ name: string }>`
          SELECT name FROM teams WHERE id = ${teamHomeId} LIMIT 1
        `;
        if (homeTeamRows.length > 0) {
          teamHomeName = String(homeTeamRows[0].name);
        }
      }

      if (teamAwayId) {
        const { rows: awayTeamRows } = await sql<{ name: string }>`
          SELECT name FROM teams WHERE id = ${teamAwayId} LIMIT 1
        `;
        if (awayTeamRows.length > 0) {
          teamAwayName = String(awayTeamRows[0].name);
        }
      }
    }
  } catch (error) {
    console.error("Failed to fetch team information:", error);
  }

  const eventRequests = requests.filter((r) => r.eventId === id);
  const eventAssignments = assignments.filter((a) => a.eventId === id);
  const userMap = new Map(users.map((u) => [u.id, { name: u.name, email: u.email }]));

  return (
    <div className="space-y-6">
      <EventDetailClient
        event={event}
        requests={eventRequests}
        assignments={eventAssignments}
        userMap={userMap}
        currentUserId={currentUserId}
        currentUserRole={role}
        changeRequests={changeRequests.map((cr) => ({
          id: cr.id,
          eventId: cr.eventId,
          changeType: cr.changeType,
          currentValue: cr.currentValue,
          requestedValue: cr.requestedValue,
          reason: cr.reason,
          status: cr.status,
          createdAt: cr.createdAt,
          requester: cr.requester,
        }))}
        gameResult={gameResult}
        teamHomeId={teamHomeId}
        teamAwayId={teamAwayId}
        teamHomeName={teamHomeName}
        teamAwayName={teamAwayName}
      />

      {/* Game Chat Thread */}
      <div className="mt-6">
        <ChatThread
          entityType="EVENT"
          entityId={id}
          currentUserId={currentUserId}
          users={userMap}
        />
      </div>
    </div>
  );
}
