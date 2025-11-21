import { getUsers } from "@/lib/repos/users";
import { requireAuth } from "@/lib/auth-helpers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export const metadata = { title: "Officials Directory" };
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function OfficialsPage() {
  const session = await requireAuth();
  const activeSchoolId = (session.user as any)?.schoolId ?? null;
  const users = await getUsers();
  const officials = users.filter((u) => u.role === "OFFICIAL" || u.role === null);
  const scopedOfficials = activeSchoolId
    ? officials.filter((official) =>
        Array.isArray(official.schoolIds)
          ? official.schoolIds.includes(activeSchoolId)
          : true
      )
    : officials;

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Officials Directory</h1>
        <p className="text-sm text-muted-foreground">
          Browse and search registered officials.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {scopedOfficials.map((official) => (
          <Card key={official.id} className="bg-card/80">
            <CardHeader>
              <CardTitle className="text-lg">{official.name}</CardTitle>
              <p className="text-xs text-muted-foreground">{official.email}</p>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              {official.role && (
                <Badge className="bg-[hsl(var(--accent)/0.2)] text-[hsl(var(--accent))]">
                  {official.role}
                </Badge>
              )}
              {official.schoolIds && official.schoolIds.length > 0 && (
                <div>
                  <p className="font-semibold text-foreground">Schools</p>
                  <p>{official.schoolIds.length} school(s)</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {scopedOfficials.length === 0 && (
        <Card className="bg-card/80">
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            No officials found.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
