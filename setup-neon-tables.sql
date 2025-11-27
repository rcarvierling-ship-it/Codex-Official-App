-- Setup script for Neon database tables
-- Run this in your Neon SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table (for authentication and signups)
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(120),
	"email" varchar(255) NOT NULL UNIQUE,
	"image" varchar(1024),
	"password" varchar(255),
	"role" varchar(32) NOT NULL DEFAULT 'USER',
	"active_school_id" uuid,
	"created_at" timestamp NOT NULL DEFAULT now()
);

-- User profiles (for school associations)
CREATE TABLE IF NOT EXISTS "user_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL UNIQUE,
	"school_id" uuid,
	"created_at" timestamp NOT NULL DEFAULT now(),
	"updated_at" timestamp NOT NULL DEFAULT now()
);

-- Leagues
CREATE TABLE IF NOT EXISTS "leagues" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(160) NOT NULL,
	"slug" varchar(160) NOT NULL UNIQUE,
	"description" varchar(1024)
);

-- Schools
CREATE TABLE IF NOT EXISTS "schools" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"league_id" uuid,
	"name" varchar(160) NOT NULL,
	"slug" varchar(160) NOT NULL UNIQUE,
	-- Branding
	"primary_color" varchar(7), -- Hex color code (e.g., #FF5733)
	"secondary_color" varchar(7), -- Hex color code
	"logo_url" varchar(1024), -- URL to logo image
	"mascot_name" varchar(80), -- e.g., "Eagles", "Tigers"
	"mascot_image_url" varchar(1024), -- URL to mascot image
	"theme_json" jsonb, -- Custom theme configuration
	"updated_at" timestamp NOT NULL DEFAULT now()
);

-- Teams
CREATE TABLE IF NOT EXISTS "teams" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"school_id" uuid,
	"name" varchar(160) NOT NULL,
	"sport" varchar(80) NOT NULL,
	"level" varchar(80)
);

-- Venues
CREATE TABLE IF NOT EXISTS "venues" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(160) NOT NULL,
	"address" varchar(255),
	"city" varchar(120),
	"state" varchar(60),
	"zip" varchar(20),
	"geo_json" jsonb
);

-- Events
CREATE TABLE IF NOT EXISTS "events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"league_id" uuid,
	"school_id" uuid,
	"team_home_id" uuid,
	"team_away_id" uuid,
	"venue_id" uuid,
	"start_ts" timestamp,
	"end_ts" timestamp,
	"sport" varchar(80),
	"level" varchar(80),
	"notes" varchar(1024),
	"created_by" uuid
);

-- Requests
CREATE TABLE IF NOT EXISTS "requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"status" varchar(16) NOT NULL DEFAULT 'PENDING',
	"created_at" timestamp NOT NULL DEFAULT now()
);

-- Assignments
CREATE TABLE IF NOT EXISTS "assignments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"assign_role" varchar(16) NOT NULL DEFAULT 'OFFICIAL'
);

-- Announcements
CREATE TABLE IF NOT EXISTS "announcements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"league_id" uuid,
	"title" varchar(200) NOT NULL,
	"body_md" varchar(5000),
	"publish_ts" timestamp DEFAULT now()
);

-- Waitlist
CREATE TABLE IF NOT EXISTS "waitlist" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(120) NOT NULL,
	"email" varchar(255) NOT NULL UNIQUE,
	"org" varchar(255),
	"role" varchar(64),
	"ip_hash" varchar(128),
	"user_agent" varchar(512),
	"created_at" timestamp NOT NULL DEFAULT now()
);

-- Feature flags
CREATE TABLE IF NOT EXISTS "feature_flags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" varchar(160) NOT NULL UNIQUE,
	"value_json" jsonb,
	"updated_at" timestamp NOT NULL DEFAULT now()
);

-- Audit logs
CREATE TABLE IF NOT EXISTS "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"action" varchar(80),
	"entity" varchar(80),
	"entity_id" varchar(80),
	"meta_json" jsonb,
	"ts" timestamp NOT NULL DEFAULT now()
);

-- Messages (for chat/notes threads on events, teams, and schools)
CREATE TABLE IF NOT EXISTS "messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"entity_type" varchar(16) NOT NULL,
	"entity_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp NOT NULL DEFAULT now()
);

-- Payments (for tracking official payments)
CREATE TABLE IF NOT EXISTS "payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"assignment_id" uuid NOT NULL UNIQUE,
	"user_id" uuid NOT NULL,
	"event_id" uuid NOT NULL,
	"amount" decimal(10, 2) NOT NULL,
	"status" varchar(16) NOT NULL DEFAULT 'PENDING',
	"approved_by" uuid,
	"approved_at" timestamp,
	"paid_at" timestamp,
	"notes" text,
	"created_at" timestamp NOT NULL DEFAULT now()
);

-- Payout Settings (for league/school payment configuration)
CREATE TABLE IF NOT EXISTS "payout_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"league_id" uuid,
	"school_id" uuid,
	"default_amount" decimal(10, 2) NOT NULL DEFAULT 75.00,
	"role_based_amounts" jsonb,
	"auto_approve" boolean NOT NULL DEFAULT false,
	"updated_at" timestamp NOT NULL DEFAULT now(),
	UNIQUE(COALESCE(league_id::text, ''), COALESCE(school_id::text, ''))
);

-- User School Roles (for multi-school/role support)
CREATE TABLE IF NOT EXISTS "user_school_roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"school_id" uuid,
	"league_id" uuid,
	"role" varchar(32) NOT NULL,
	"is_active" boolean NOT NULL DEFAULT false,
	"created_at" timestamp NOT NULL DEFAULT now(),
	UNIQUE(user_id, COALESCE(school_id::text, ''), COALESCE(league_id::text, ''), role)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON "users"("email");
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON "user_profiles"("email");
CREATE INDEX IF NOT EXISTS idx_events_school_id ON "events"("school_id");
CREATE INDEX IF NOT EXISTS idx_events_league_id ON "events"("league_id");
CREATE INDEX IF NOT EXISTS idx_requests_event_id ON "requests"("event_id");
CREATE INDEX IF NOT EXISTS idx_requests_user_id ON "requests"("user_id");
CREATE INDEX IF NOT EXISTS idx_assignments_event_id ON "assignments"("event_id");
CREATE INDEX IF NOT EXISTS idx_assignments_user_id ON "assignments"("user_id");
CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON "waitlist"("created_at" DESC);
CREATE INDEX IF NOT EXISTS idx_messages_entity ON "messages"("entity_type", "entity_id");
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON "messages"("user_id");
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON "messages"("created_at" DESC);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON "payments"("user_id");
CREATE INDEX IF NOT EXISTS idx_payments_status ON "payments"("status");
CREATE INDEX IF NOT EXISTS idx_payments_event_id ON "payments"("event_id");
CREATE INDEX IF NOT EXISTS idx_payments_assignment_id ON "payments"("assignment_id");
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON "payments"("created_at" DESC);
CREATE INDEX IF NOT EXISTS idx_user_school_roles_user_id ON "user_school_roles"("user_id");
CREATE INDEX IF NOT EXISTS idx_user_school_roles_is_active ON "user_school_roles"("is_active");
CREATE INDEX IF NOT EXISTS idx_user_school_roles_school_id ON "user_school_roles"("school_id");
CREATE INDEX IF NOT EXISTS idx_user_school_roles_league_id ON "user_school_roles"("league_id");

-- Game Change Requests (for coaches to request event changes)
CREATE TABLE IF NOT EXISTS "game_change_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" uuid NOT NULL,
	"requested_by" uuid NOT NULL,
	"change_type" varchar(32) NOT NULL, -- TIME, LOCATION, OPPONENT, CANCELLATION, POSTPONEMENT
	"current_value" text,
	"requested_value" text,
	"reason" varchar(1024),
	"status" varchar(16) NOT NULL DEFAULT 'PENDING', -- PENDING, APPROVED, DENIED
	"approved_by" uuid,
	"approved_at" timestamp,
	"created_at" timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_game_change_requests_event_id ON "game_change_requests"("event_id");
CREATE INDEX IF NOT EXISTS idx_game_change_requests_requested_by ON "game_change_requests"("requested_by");
CREATE INDEX IF NOT EXISTS idx_game_change_requests_status ON "game_change_requests"("status");
CREATE INDEX IF NOT EXISTS idx_game_change_requests_created_at ON "game_change_requests"("created_at" DESC);

-- Official Availability Blocks (for officials to mark when they're available/unavailable)
CREATE TABLE IF NOT EXISTS "availability_blocks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"official_id" uuid NOT NULL, -- The user (official) who set this availability
	"start_time" timestamp NOT NULL, -- Start of availability/unavailability block
	"end_time" timestamp NOT NULL, -- End of availability/unavailability block
	"is_available" boolean NOT NULL DEFAULT TRUE, -- true = available, false = unavailable
	"notes" varchar(512), -- Optional notes (e.g., "Prefer morning games")
	"created_at" timestamp NOT NULL DEFAULT now(),
	"updated_at" timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_availability_blocks_official_id ON "availability_blocks"("official_id");
CREATE INDEX IF NOT EXISTS idx_availability_blocks_start_time ON "availability_blocks"("start_time");
CREATE INDEX IF NOT EXISTS idx_availability_blocks_end_time ON "availability_blocks"("end_time");
CREATE INDEX IF NOT EXISTS idx_availability_blocks_is_available ON "availability_blocks"("is_available");
CREATE INDEX IF NOT EXISTS idx_availability_blocks_time_range ON "availability_blocks"("start_time", "end_time");

-- Game Results (for standings and leaderboards)
CREATE TABLE IF NOT EXISTS "game_results" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" uuid NOT NULL UNIQUE, -- One result per event/game
	"team_home_id" uuid NOT NULL,
	"team_away_id" uuid NOT NULL,
	"home_score" varchar(10), -- Score as string to handle various formats
	"away_score" varchar(10),
	"status" varchar(16) NOT NULL DEFAULT 'SCHEDULED', -- SCHEDULED, COMPLETED, CANCELLED, POSTPONED
	"recorded_by" uuid, -- Official who submitted the score
	"recorded_at" timestamp,
	"verified_by" uuid, -- Coach who verified the score
	"verified_at" timestamp,
	"is_locked" boolean NOT NULL DEFAULT FALSE, -- League admin can lock/finalize
	"locked_by" uuid, -- League admin who locked the score
	"locked_at" timestamp,
	"created_at" timestamp NOT NULL DEFAULT now(),
	"updated_at" timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_game_results_event_id ON "game_results"("event_id");
CREATE INDEX IF NOT EXISTS idx_game_results_team_home_id ON "game_results"("team_home_id");
CREATE INDEX IF NOT EXISTS idx_game_results_team_away_id ON "game_results"("team_away_id");
CREATE INDEX IF NOT EXISTS idx_game_results_status ON "game_results"("status");

