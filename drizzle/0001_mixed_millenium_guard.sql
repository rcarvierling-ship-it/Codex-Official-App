CREATE TYPE "public"."assign_role" AS ENUM('OFFICIAL', 'SCORER', 'ANNOUNCER');--> statement-breakpoint
CREATE TYPE "public"."request_status" AS ENUM('PENDING', 'APPROVED', 'DECLINED');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('SUPER_ADMIN', 'ADMIN', 'AD', 'COACH', 'OFFICIAL', 'USER');--> statement-breakpoint
CREATE TABLE "assignments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"role" "assign_role" DEFAULT 'OFFICIAL' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"action" varchar(80),
	"entity" varchar(80),
	"entity_id" varchar(80),
	"meta_json" jsonb,
	"ts" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "feature_flags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" varchar(160) NOT NULL,
	"value_json" jsonb,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "feature_flags_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "leagues" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(160) NOT NULL,
	"slug" varchar(160) NOT NULL,
	"description" varchar(1024),
	CONSTRAINT "leagues_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"status" "request_status" DEFAULT 'PENDING' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "schools" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"league_id" uuid,
	"name" varchar(160) NOT NULL,
	"slug" varchar(160) NOT NULL,
	CONSTRAINT "schools_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "teams" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"school_id" uuid,
	"name" varchar(160) NOT NULL,
	"sport" varchar(80) NOT NULL,
	"level" varchar(80)
);
--> statement-breakpoint
CREATE TABLE "venues" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(160) NOT NULL,
	"address" varchar(255),
	"city" varchar(120),
	"state" varchar(60),
	"zip" varchar(20),
	"geo_json" jsonb
);
--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "created_by" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "name" SET DATA TYPE varchar(120);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "email" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "image" SET DATA TYPE varchar(1024);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'USER'::"public"."role";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DATA TYPE "public"."role" USING "role"::"public"."role";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "waitlist" ALTER COLUMN "name" SET DATA TYPE varchar(120);--> statement-breakpoint
ALTER TABLE "waitlist" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "waitlist" ALTER COLUMN "email" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "waitlist" ALTER COLUMN "org" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "waitlist" ALTER COLUMN "role" SET DATA TYPE varchar(64);--> statement-breakpoint
ALTER TABLE "waitlist" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "league_id" uuid;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "school_id" uuid;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "team_home_id" uuid;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "team_away_id" uuid;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "venue_id" uuid;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "start_ts" timestamp;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "end_ts" timestamp;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "sport" varchar(80);--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "level" varchar(80);--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "notes" varchar(1024);--> statement-breakpoint
ALTER TABLE "events" DROP COLUMN "title";--> statement-breakpoint
ALTER TABLE "events" DROP COLUMN "date";--> statement-breakpoint
ALTER TABLE "events" DROP COLUMN "location";