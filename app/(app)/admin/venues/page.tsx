import { requireRole } from "@/lib/auth-helpers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { sql } from "@/lib/db";

export const metadata = { title: "Admin Venues" };
export const dynamic = "force-dynamic";

async function getVenues() {
  try {
    const { rows } = await sql`select * from venues order by name asc`;
    return rows.map((r: any) => ({
      id: String(r.id ?? r.venue_id ?? crypto.randomUUID()),
      name: String(r.name ?? r.venue_name ?? "Unknown Venue"),
      address: r.address ?? null,
      city: r.city ?? null,
      state: r.state ?? null,
      capacity: r.capacity ?? null,
    }));
  } catch {
    return [];
  }
}

export default async function AdminVenuesPage() {
  await requireRole("SUPER_ADMIN");
  const venues = await getVenues();

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Venues</h1>
        <p className="text-sm text-muted-foreground">
          Manage all venues and facilities across the system.
        </p>
      </header>

      {venues.length === 0 ? (
        <Card className="bg-card/80">
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            No venues found. Add your first venue to get started.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {venues.map((venue) => (
            <Card key={venue.id} className="bg-card/80">
              <CardHeader>
                <CardTitle className="text-lg">{venue.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                {(venue.city || venue.state) && (
                  <p>
                    {venue.city}
                    {venue.city && venue.state ? ", " : ""}
                    {venue.state}
                  </p>
                )}
                {venue.address && (
                  <p className="text-xs">{venue.address}</p>
                )}
                {venue.capacity && (
                  <Badge variant="outline" className="text-xs">
                    Capacity: {venue.capacity}
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

