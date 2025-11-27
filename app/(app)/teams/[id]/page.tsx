import { requireAuth } from "@/lib/auth-helpers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { sql } from "@/lib/db";
import { notFound } from "next/navigation";
import { getUsers } from "@/lib/repos/users";
import { ChatThread } from "@/components/chat/ChatThread";
import { getTeamStanding } from "@/lib/repos/standings";
import { StandingsTable } from "@/components/standings/StandingsTable";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { SessionUser } from "@/lib/types/auth";

export const metadata = { title: "Team Details" };
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function getTeamById(id: string) {
  try {
    const { rows } = await sql<{
      id: string;
      name: string;
      school_id: string | null;
      sport: string | null;
      level: string | null;
    }>`
      SELECT id, name, school_id, sport, level
      FROM teams
      WHERE id = ${id}
      LIMIT 1
    `;
    if (rows.length === 0) return null;
    return {
      id: rows[0].id,
      name: rows[0].name,
      schoolId: rows[0].school_id,
      sport: rows[0].sport,
      level: rows[0].level,
    };
  } catch {
    return null;
  }
}

export default async function TeamDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await requireAuth();
  const user = session.user as SessionUser;
  const canSeeAll = user.canSeeAll ?? false;
  const accessibleSchools = user.accessibleSchools ?? [];
  const { id } = params;

  const [team, users] = await Promise.all([
    getTeamById(id),
    getUsers(),
  ]);

  if (!team) {
    notFound();
  }

  // Check if user has access to this team's school
  if (!canSeeAll && team.schoolId && !accessibleSchools.includes(team.schoolId)) {
    notFound();
  }

  const userMap = new Map(users.map((u) => [u.id, { name: u.name, email: u.email }]));

  // Get team's league ID from events
  let leagueId: string | undefined;
  let teamStanding = null;
  
  try {
    const { rows: eventRows } = await sql<{ league_id: string | null }>`
      SELECT DISTINCT league_id
      FROM events
      WHERE (team_home_id = ${id} OR team_away_id = ${id})
        AND league_id IS NOT NULL
      LIMIT 1
    `;
    
    if (eventRows.length > 0 && eventRows[0].league_id) {
      leagueId = String(eventRows[0].league_id);
      teamStanding = await getTeamStanding(
        id,
        leagueId,
        team.sport || undefined,
        team.level || undefined
      );
    }
  } catch (error) {
    console.error("Failed to fetch team standing:", error);
  }

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">{team.name}</h1>
        <div className="flex items-center gap-2">
          {team.sport && (
            <Badge variant="outline" className="text-xs">
              {team.sport}
            </Badge>
          )}
          {team.level && (
            <Badge variant="outline" className="text-xs">
              {team.level}
            </Badge>
          )}
        </div>
      </header>

      {/* Team Standing */}
      {teamStanding && (
        <Card className="bg-card/80">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Current Standing</CardTitle>
            <Button asChild variant="outline" size="sm">
              <Link href="/standings">View Full Standings</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <StandingsTable
              standings={[teamStanding]}
              divisionName={`${team.sport || "Sport"} - ${team.level || "Level"}`}
            />
          </CardContent>
        </Card>
      )}

      {/* Team Chat Thread */}
      <ChatThread
        entityType="TEAM"
        entityId={id}
        currentUserId={user.id || ""}
        users={userMap}
      />
    </div>
  );
}

