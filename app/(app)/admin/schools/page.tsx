import { requireRole } from "@/lib/auth-helpers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { sql } from "@/lib/db";

export const metadata = { title: "Schools" };
export const dynamic = "force-dynamic";

async function getSchools() {
  try {
    const { rows } = await sql`select * from schools order by name asc`;
    return rows.map((r: any) => ({
      id: String(r.id ?? r.school_id ?? crypto.randomUUID()),
      name: String(r.name ?? r.school_name ?? "Unknown School"),
      district: r.district ?? null,
      city: r.city ?? null,
      state: r.state ?? null,
      type: r.type ?? r.school_type ?? null,
    }));
  } catch {
    return [];
  }
}

export default async function SchoolsPage() {
  await requireRole("SUPER_ADMIN");
  const schools = await getSchools();

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
                {school.district && <p>District: {school.district}</p>}
                {(school.city || school.state) && (
                  <p>
                    {school.city}
                    {school.city && school.state ? ", " : ""}
                    {school.state}
                  </p>
                )}
                {school.type && (
                  <Badge variant="outline" className="text-xs">
                    {school.type}
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

