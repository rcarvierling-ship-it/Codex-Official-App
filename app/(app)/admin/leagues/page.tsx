import { requireRole } from "@/lib/auth-helpers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { sql } from "@/lib/db";

export const metadata = { title: "Leagues" };
export const dynamic = "force-dynamic";

async function getLeagues() {
  try {
    const { rows } = await sql`select * from leagues order by name asc`;
    return rows.map((r: any) => ({
      id: String(r.id ?? r.league_id ?? crypto.randomUUID()),
      name: String(r.name ?? r.league_name ?? "Unknown League"),
      sport: r.sport ?? null,
      season: r.season ?? null,
      status: r.status ?? "active",
    }));
  } catch {
    return [];
  }
}

export default async function LeaguesPage() {
  await requireRole("SUPER_ADMIN");
  const leagues = await getLeagues();

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Leagues</h1>
        <p className="text-sm text-muted-foreground">
          Manage all leagues in the system.
        </p>
      </header>

      {leagues.length === 0 ? (
        <Card className="bg-card/80">
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            No leagues found. Create your first league to get started.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {leagues.map((league) => (
            <Card key={league.id} className="bg-card/80">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{league.name}</CardTitle>
                  <Badge
                    variant={league.status === "active" ? "default" : "outline"}
                    className="text-xs"
                  >
                    {league.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                {league.sport && (
                  <Badge variant="outline" className="text-xs">
                    {league.sport}
                  </Badge>
                )}
                {league.season && <p>Season: {league.season}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

