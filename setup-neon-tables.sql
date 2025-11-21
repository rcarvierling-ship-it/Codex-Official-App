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
	"slug" varchar(160) NOT NULL UNIQUE
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

