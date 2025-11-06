CREATE TABLE "announcements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"league_id" uuid,
	"title" varchar(200) NOT NULL,
	"body_md" varchar(5000),
	"publish_ts" timestamp DEFAULT now()
);
