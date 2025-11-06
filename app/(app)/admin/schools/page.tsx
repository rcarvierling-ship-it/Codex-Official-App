import { requireRole } from "@/lib/auth-helpers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { listSchools } from "@/lib/repos/schools";

export const metadata = { title: "Schools" };
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function SchoolsPage() {
  await requireRole("SUPER_ADMIN");
  const schools = await listSchools();

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Schools</h1>
        <p className="text-sm text-muted-foreground">
          Manage all schools in the system.
        </p>
      </header>

      {schools.length === 0 ? (
        <Card className="bg-card/80">
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            No schools found. Add your first school to get started.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {schools.map((school) => (
            <Card key={school.id} className="bg-card/80">
              <CardHeader>
                <CardTitle className="text-lg">{school.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <Badge variant="outline" className="text-xs">
                  {school.slug}
                </Badge>
                {school.leagueId && (
                  <p className="text-xs">League: {school.leagueId}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
