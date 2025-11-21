ALTER TABLE "requests" ALTER COLUMN "status" SET DATA TYPE varchar(16);--> statement-breakpoint
ALTER TABLE "requests" ALTER COLUMN "status" SET DEFAULT 'PENDING';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DATA TYPE varchar(32);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'USER';--> statement-breakpoint
ALTER TABLE "assignments" ADD COLUMN "assign_role" varchar(16) DEFAULT 'OFFICIAL' NOT NULL;--> statement-breakpoint
ALTER TABLE "assignments" DROP COLUMN "role";--> statement-breakpoint
DROP TYPE "public"."assign_role";--> statement-breakpoint
DROP TYPE "public"."request_status";--> statement-breakpoint
DROP TYPE "public"."role";