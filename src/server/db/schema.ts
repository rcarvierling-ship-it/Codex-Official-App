// src/server/db/schema.ts
import {
  pgTable, uuid, varchar, timestamp, jsonb,
} from "drizzle-orm/pg-core";

// users
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 120 }),
  email: varchar("email", { length: 255 }).notNull().unique(),
  image: varchar("image", { length: 1024 }),
  password: varchar("password", { length: 255 }),
  // was enum before; using varchar to unblock
  role: varchar("role", { length: 32 }).notNull().default("USER"),
  activeSchoolId: uuid("active_school_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// leagues/schools/teams/venues
export const leagues = pgTable("leagues", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  slug: varchar("slug", { length: 160 }).notNull().unique(),
  description: varchar("description", { length: 1024 }),
});

export const schools = pgTable("schools", {
  id: uuid("id").defaultRandom().primaryKey(),
  leagueId: uuid("league_id"),
  name: varchar("name", { length: 160 }).notNull(),
  slug: varchar("slug", { length: 160 }).notNull().unique(),
});

export const teams = pgTable("teams", {
  id: uuid("id").defaultRandom().primaryKey(),
  schoolId: uuid("school_id"),
  name: varchar("name", { length: 160 }).notNull(),
  sport: varchar("sport", { length: 80 }).notNull(),
  level: varchar("level", { length: 80 }),
});

export const venues = pgTable("venues", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  address: varchar("address", { length: 255 }),
  city: varchar("city", { length: 120 }),
  state: varchar("state", { length: 60 }),
  zip: varchar("zip", { length: 20 }),
  geoJson: jsonb("geo_json"),
});

// events/requests/assignments
export const events = pgTable("events", {
  id: uuid("id").defaultRandom().primaryKey(),
  leagueId: uuid("league_id"),
  schoolId: uuid("school_id"),
  teamHomeId: uuid("team_home_id"),
  teamAwayId: uuid("team_away_id"),
  venueId: uuid("venue_id"),
  startTs: timestamp("start_ts"),
  endTs: timestamp("end_ts"),
  sport: varchar("sport", { length: 80 }),
  level: varchar("level", { length: 80 }),
  notes: varchar("notes", { length: 1024 }),
  createdBy: uuid("created_by"),
});

export const announcements = pgTable("announcements", {
  id: uuid("id").defaultRandom().primaryKey(),
  leagueId: uuid("league_id"),
  title: varchar("title", { length: 200 }).notNull(),
  bodyMd: varchar("body_md", { length: 5000 }),
  publishTs: timestamp("publish_ts").defaultNow(),
});

export const requests = pgTable("requests", {
  id: uuid("id").defaultRandom().primaryKey(),
  eventId: uuid("event_id").notNull(),
  userId: uuid("user_id").notNull(),
  // was enum before; using varchar to unblock
  status: varchar("status", { length: 16 }).notNull().default("PENDING"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const assignments = pgTable("assignments", {
  id: uuid("id").defaultRandom().primaryKey(),
  eventId: uuid("event_id").notNull(),
  userId: uuid("user_id").notNull(),
  // was enum before; using varchar to unblock
  role: varchar("assign_role", { length: 16 }).notNull().default("OFFICIAL"),
});

// waitlist/flags/audit
export const waitlist = pgTable("waitlist", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  org: varchar("org", { length: 255 }),
  role: varchar("role", { length: 64 }),
  ipHash: varchar("ip_hash", { length: 128 }),
  userAgent: varchar("user_agent", { length: 512 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const featureFlags = pgTable("feature_flags", {
  id: uuid("id").defaultRandom().primaryKey(),
  key: varchar("key", { length: 160 }).notNull().unique(),
  valueJson: jsonb("value_json"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id"),
  action: varchar("action", { length: 80 }),
  entity: varchar("entity", { length: 80 }),
  entityId: varchar("entity_id", { length: 80 }),
  metaJson: jsonb("meta_json"),
  ts: timestamp("ts").notNull().defaultNow(),
});

export const userProfiles = pgTable("user_profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  schoolId: uuid("school_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
