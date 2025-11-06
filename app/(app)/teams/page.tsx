import { requireAuth } from "@/lib/auth-helpers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { sql } from "@/lib/db";

export const metadata = { title: "Teams" };
export const dynamic = "force-dynamic";

async function getTeams() {
  try {
    const { rows } = await sql`select * from teams order by name asc`;
    return rows.map((r: any) => ({
      id: String(r.id ?? r.team_id ?? crypto.randomUUID()),
      name: String(r.name ?? r.team_name ?? "Unknown Team"),
      schoolId: r.school_id ?? r.school ?? null,
      sport: r.sport ?? null,
      level: r.level ?? null,
    }));
  } catch {
    return [];
  }
}

export default async function TeamsPage() {
  await requireAuth();
  const teams = await getTeams();

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Teams</h1>
        <p className="text-sm text-muted-foreground">
          View and manage all teams across your organization.
        </p>
      </header>

      {teams.length === 0 ? (
        <Card className="bg-card/80">
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            No teams found. Create your first team to get started.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {teams.map((team) => (
            <Card key={team.id} className="bg-card/80">
              <CardHeader>
                <CardTitle className="text-lg">{team.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                {team.sport && (
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {team.sport}
                    </Badge>
                    {team.level && (
                      <Badge variant="outline" className="text-xs">
                        {team.level}
                      </Badge>
                    )}
                  </div>
                )}
                {team.schoolId && (
                  <p className="text-xs">School ID: {team.schoolId}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

