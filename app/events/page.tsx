import { eq } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";

import { db } from "@/server/db/client";
import { events, teams, venues } from "@/server/db/schema";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

const homeTeams = alias(teams, "homeTeams");
const awayTeams = alias(teams, "awayTeams");

function formatDateTime(value: Date | null) {
  if (!value) {
    return "TBD";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

export default async function EventsPage() {
  const data = await db
    .select({
      id: events.id,
      startTs: events.startTs,
      sport: events.sport,
      level: events.level,
      notes: events.notes,
      homeTeam: homeTeams.name,
      awayTeam: awayTeams.name,
      venue: venues.name,
      city: venues.city,
      state: venues.state,
    })
    .from(events)
    .leftJoin(homeTeams, eq(homeTeams.id, events.teamHomeId))
    .leftJoin(awayTeams, eq(awayTeams.id, events.teamAwayId))
    .leftJoin(venues, eq(venues.id, events.venueId));

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 py-12 px-4">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Events</h1>
        <p className="text-sm text-muted-foreground">
          Live data from Vercel Postgres via Drizzle ORM.
        </p>
      </div>

      {data.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            No events found. Seed the database to get started.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {data.map((event) => (
            <Card key={event.id}>
              <CardHeader className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                <CardTitle className="text-xl">
                  {event.homeTeam ?? "Home"} vs {event.awayTeam ?? "Away"}
                </CardTitle>
                <span className="text-sm text-muted-foreground">
                  {formatDateTime(event.startTs)}
                </span>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex flex-wrap gap-2 text-muted-foreground">
                  {event.sport && <span className="font-medium">{event.sport}</span>}
                  {event.level && <span>• {event.level}</span>}
                </div>
                <div className="text-muted-foreground">
                  Venue:{" "}
                  {event.venue
                    ? `${event.venue}${event.city ? ` · ${event.city}${event.state ? `, ${event.state}` : ""}` : ""}`
                    : "TBD"}
                </div>
                {event.notes && (
                  <p className="text-muted-foreground">Notes: {event.notes}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
