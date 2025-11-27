import { requireAuth } from "@/lib/auth-helpers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { sql } from "@/lib/db";
import { getEvents } from "@/lib/repos/events";
import type { SessionUser } from "@/lib/types/auth";

export const metadata = { title: "Venues" };
export const runtime = "nodejs";
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

export default async function VenuesPage() {
  const session = await requireAuth();
  const user = session.user as SessionUser;
  const canSeeAll = user.canSeeAll ?? false;
  const accessibleSchools = user.accessibleSchools ?? [];
  const accessibleLeagues = user.accessibleLeagues ?? [];

  const filterBy = canSeeAll
    ? null
    : { schoolIds: accessibleSchools, leagueIds: accessibleLeagues };

  const [venues, events] = await Promise.all([getVenues(), getEvents(filterBy)]);
  const relevantVenueIds = new Set(
    events
      .map((event) => event.venueId)
      .filter((id): id is string => Boolean(id))
  );

  const scopedVenues =
    relevantVenueIds.size > 0
      ? venues.filter((venue) => relevantVenueIds.has(venue.id))
      : venues;

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Venues</h1>
        <p className="text-sm text-muted-foreground">
          Manage all venues and facilities for events.
        </p>
      </header>

      {scopedVenues.length === 0 ? (
        <Card className="bg-card/80">
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            No venues found. Add your first venue to get started.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {scopedVenues.map((venue) => (
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
