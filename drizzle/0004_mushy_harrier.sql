ALTER TABLE "users" ADD COLUMN "password" varchar(255);--> statement-breakpoint
ALTER TABLE "waitlist" ADD COLUMN "ip_hash" varchar(128);--> statement-breakpoint
ALTER TABLE "waitlist" ADD COLUMN "user_agent" varchar(512);