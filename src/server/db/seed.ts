import { db } from "./client";
import {
  users, leagues, schools, teams, venues, events, waitlist, announcements
} from "./schema";

async function main() {
  // 1) Super admin (unique by email)
  await db.insert(users).values({
    name: "Super Admin",
    email: "admin@theofficial.app",
    role: "SUPER_ADMIN",
  }).onConflictDoNothing({ target: users.email });

  // 2) League (unique by slug)
  const league = await db.insert(leagues).values({
    name: "Demo League",
    slug: "demo-league",
    description: "Seeded league",
  }).onConflictDoNothing({ target: leagues.slug })
    .returning({ id: leagues.id });

  const leagueId = league[0]?.id;

  // 3) School (unique by slug)
  const school = await db.insert(schools).values({
    leagueId,
    name: "Central High",
    slug: "central-high",
  }).onConflictDoNothing({ target: schools.slug })
    .returning({ id: schools.id });

  const schoolId = school[0]?.id;

  // 4) Teams (no unique, just seed if not present)
  const homeTeam = await db.insert(teams).values({
    schoolId, name: "Central Lions", sport: "Basketball", level: "Varsity",
  }).returning({ id: teams.id });
  const homeTeamId = homeTeam[0]?.id;

  const awayTeam = await db.insert(teams).values({
    schoolId, name: "West Wolves", sport: "Basketball", level: "Varsity",
  }).returning({ id: teams.id });
  const awayTeamId = awayTeam[0]?.id;

  // 5) Venue
  const venue = await db.insert(venues).values({
    name: "Main Gym", city: "Louisville", state: "KY",
  }).returning({ id: venues.id });
  const venueId = venue[0]?.id;

  // 6) Event
  await db.insert(events).values({
    leagueId,
    schoolId,
    teamHomeId: homeTeamId,
    teamAwayId: awayTeamId,
    venueId,
    sport: "Basketball",
    level: "Varsity",
    startTs: new Date(Date.now() + 3 * 24 * 3600e3),
    notes: "Season opener",
  });

  // 7) Waitlist (unique by email)
  await db.insert(waitlist).values({
    name: "Demo User",
    email: "demo@example.com",
    org: "Demo Org",
    role: "Coach",
  }).onConflictDoNothing({ target: waitlist.email });

  // 8) Announcement (optional)
  if (leagueId) {
    await db.insert(announcements).values({
      leagueId,
      title: "Welcome to The Official App",
      bodyMd: "This is a seeded announcement. Edit it in /admin.",
    });
  }

  console.log("✅ Seed complete");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
