// src/server/db/schema.ts
import {
  pgTable, uuid, varchar, timestamp, jsonb, text, boolean,
} from "drizzle-orm/pg-core";

// users
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 120 }),
  email: varchar("email", { length: 255 }).notNull().unique(),
  image: varchar("image", { length: 1024 }),
  password: varchar("password", { length: 255 }),
  // was enum before; using varchar to unblock
  role: varchar("role", { length: 32 }).notNull().default("fan"),
  activeSchoolId: uuid("active_school_id"),
  onboardingCompleted: boolean("onboarding_completed").notNull().default(false),
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
  // Branding
  primaryColor: varchar("primary_color", { length: 7 }), // Hex color code (e.g., #FF5733)
  secondaryColor: varchar("secondary_color", { length: 7 }), // Hex color code
  logoUrl: varchar("logo_url", { length: 1024 }), // URL to logo image
  mascotName: varchar("mascot_name", { length: 80 }), // e.g., "Eagles", "Tigers"
  mascotImageUrl: varchar("mascot_image_url", { length: 1024 }), // URL to mascot image
  themeJson: jsonb("theme_json"), // Custom theme configuration
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
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

export const messages = pgTable("messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  entityType: varchar("entity_type", { length: 16 }).notNull(),
  entityId: uuid("entity_id").notNull(),
  userId: uuid("user_id").notNull(),
  content: varchar("content", { length: 5000 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const payments = pgTable("payments", {
  id: uuid("id").defaultRandom().primaryKey(),
  assignmentId: uuid("assignment_id").notNull().unique(),
  userId: uuid("user_id").notNull(),
  eventId: uuid("event_id").notNull(),
  amount: varchar("amount", { length: 20 }).notNull(), // Using varchar for decimal
  status: varchar("status", { length: 16 }).notNull().default("PENDING"),
  approvedBy: uuid("approved_by"),
  approvedAt: timestamp("approved_at"),
  paidAt: timestamp("paid_at"),
  notes: varchar("notes", { length: 1000 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const payoutSettings = pgTable("payout_settings", {
  id: uuid("id").defaultRandom().primaryKey(),
  leagueId: uuid("league_id"),
  schoolId: uuid("school_id"),
  defaultAmount: varchar("default_amount", { length: 20 }).notNull().default("75.00"),
  roleBasedAmounts: jsonb("role_based_amounts"),
  autoApprove: varchar("auto_approve", { length: 5 }).notNull().default("false"), // Using varchar for boolean
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const userSchoolRoles = pgTable("user_school_roles", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  schoolId: uuid("school_id"),
  leagueId: uuid("league_id"),
  role: varchar("role", { length: 32 }).notNull(),
  isActive: varchar("is_active", { length: 5 }).notNull().default("false"), // Using varchar for boolean
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const gameChangeRequests = pgTable("game_change_requests", {
  id: uuid("id").defaultRandom().primaryKey(),
  eventId: uuid("event_id").notNull(),
  requestedBy: uuid("requested_by").notNull(),
  changeType: varchar("change_type", { length: 32 }).notNull(),
  currentValue: text("current_value"),
  requestedValue: text("requested_value"),
  reason: varchar("reason", { length: 1024 }),
  status: varchar("status", { length: 16 }).notNull().default("PENDING"),
  approvedBy: uuid("approved_by"),
  approvedAt: timestamp("approved_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Official availability blocks
export const availabilityBlocks = pgTable("availability_blocks", {
  id: uuid("id").defaultRandom().primaryKey(),
  officialId: uuid("official_id").notNull(), // The user (official) who set this availability
  startTime: timestamp("start_time").notNull(), // Start of availability/unavailability block
  endTime: timestamp("end_time").notNull(), // End of availability/unavailability block
  isAvailable: boolean("is_available").notNull().default(true), // true = available, false = unavailable
  notes: varchar("notes", { length: 512 }), // Optional notes (e.g., "Prefer morning games")
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Game results for standings/leaderboards
export const gameResults = pgTable("game_results", {
  id: uuid("id").defaultRandom().primaryKey(),
  eventId: uuid("event_id").notNull().unique(), // One result per event/game
  teamHomeId: uuid("team_home_id").notNull(),
  teamAwayId: uuid("team_away_id").notNull(),
  homeScore: varchar("home_score", { length: 10 }), // Score as string to handle various formats
  awayScore: varchar("away_score", { length: 10 }),
  status: varchar("status", { length: 16 }).notNull().default("SCHEDULED"), // SCHEDULED, COMPLETED, CANCELLED, POSTPONED
  recordedBy: uuid("recorded_by"), // Official who submitted the score
  recordedAt: timestamp("recorded_at"),
  verifiedBy: uuid("verified_by"), // Coach who verified the score
  verifiedAt: timestamp("verified_at"),
  isLocked: boolean("is_locked").notNull().default(false), // League admin can lock/finalize
  lockedBy: uuid("locked_by"), // League admin who locked the score
  lockedAt: timestamp("locked_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
