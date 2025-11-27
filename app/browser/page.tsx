import { PublicBrowserClient } from "./PublicBrowserClient";
import { listSchools } from "@/lib/repos/schools";
import { getEvents } from "@/lib/repos/events";
import { sql } from "@/lib/db";

export const metadata = {
  title: "Browse Leagues, Schools & Schedules | The Official App",
  description: "Search leagues, schools, and view game schedules. Public directory of athletic events and organizations.",
  openGraph: {
    title: "Browse Leagues, Schools & Schedules",
    description: "Search leagues, schools, and view game schedules.",
  },
};

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function getLeagues() {
  try {
    const { rows } = await sql<{
      id: string;
      name: string;
      slug: string;
      description: string | null;
    }>`
      SELECT id, name, slug, description
      FROM leagues
      ORDER BY name ASC
    `;
    return rows;
  } catch {
    return [];
  }
}

export default async function BrowserPage() {
  const [leagues, schools, events] = await Promise.all([
    getLeagues(),
    listSchools(),
    getEvents(null), // Get all events for public view
  ]);

  return (
    <PublicBrowserClient
      initialLeagues={leagues}
      initialSchools={schools}
      initialEvents={events.map((e) => ({
        id: e.id,
        name: e.name,
        startsAt: e.startsAt,
        endsAt: e.endsAt,
        schoolId: e.schoolId,
        leagueId: e.leagueId,
      }))}
    />
  );
}

