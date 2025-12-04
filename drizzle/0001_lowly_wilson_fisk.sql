CREATE TABLE "admin_users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"name" varchar(255),
	"role" varchar(50) DEFAULT 'admin' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"last_login_at" timestamp,
	CONSTRAINT "admin_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "contact_submissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"first_name" varchar(255) NOT NULL,
	"last_name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"subject" varchar(500) NOT NULL,
	"message" text NOT NULL,
	"status" varchar(50) DEFAULT 'unread' NOT NULL,
	"submitted_at" timestamp DEFAULT now() NOT NULL,
	"replied_at" timestamp,
	"admin_notes" text
);
--> statement-breakpoint
ALTER TABLE "artist_applications" RENAME COLUMN "social_media" TO "social_media_handles";--> statement-breakpoint
ALTER TABLE "artist_applications" ALTER COLUMN "phone" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "artist_applications" ALTER COLUMN "stage_name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "artist_applications" ALTER COLUMN "performance_type" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "artist_applications" ALTER COLUMN "performance_type" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "artist_applications" ALTER COLUMN "previous_performances" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "artist_applications" ALTER COLUMN "motivation" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "media_accreditation" ALTER COLUMN "agreements_accepted" SET DATA TYPE jsonb;--> statement-breakpoint
ALTER TABLE "media_accreditation" ALTER COLUMN "agreements_accepted" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "artist_applications" ADD COLUMN "age" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "artist_applications" ADD COLUMN "gender" varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE "artist_applications" ADD COLUMN "city" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "artist_applications" ADD COLUMN "performance_category" varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE "artist_applications" ADD COLUMN "style_description" text NOT NULL;--> statement-breakpoint
ALTER TABLE "artist_applications" ADD COLUMN "performance_experience" varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE "artist_applications" ADD COLUMN "group_name" varchar(255);--> statement-breakpoint
ALTER TABLE "artist_applications" ADD COLUMN "performance_link" varchar(500) NOT NULL;--> statement-breakpoint
ALTER TABLE "artist_applications" ADD COLUMN "performance_image_url" varchar(500);--> statement-breakpoint
ALTER TABLE "artist_applications" ADD COLUMN "performance_image_file_name" varchar(255);--> statement-breakpoint
ALTER TABLE "artist_applications" ADD COLUMN "signed_to_management" boolean NOT NULL;--> statement-breakpoint
ALTER TABLE "artist_applications" ADD COLUMN "management_info" text;--> statement-breakpoint
ALTER TABLE "artist_applications" ADD COLUMN "unique_selling_point" text NOT NULL;--> statement-breakpoint
ALTER TABLE "artist_applications" ADD COLUMN "goals" text NOT NULL;--> statement-breakpoint
ALTER TABLE "artist_applications" ADD COLUMN "agreements_accepted" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "artist_applications" DROP COLUMN "artist_name";--> statement-breakpoint
ALTER TABLE "artist_applications" DROP COLUMN "genre";--> statement-breakpoint
ALTER TABLE "artist_applications" DROP COLUMN "bio";--> statement-breakpoint
ALTER TABLE "artist_applications" DROP COLUMN "website";--> statement-breakpoint
ALTER TABLE "artist_applications" DROP COLUMN "spotify_link";--> statement-breakpoint
ALTER TABLE "artist_applications" DROP COLUMN "soundcloud_link";--> statement-breakpoint
ALTER TABLE "artist_applications" DROP COLUMN "youtube_link";--> statement-breakpoint
ALTER TABLE "artist_applications" DROP COLUMN "instagram_link";--> statement-breakpoint
ALTER TABLE "artist_applications" DROP COLUMN "facebook_link";--> statement-breakpoint
ALTER TABLE "artist_applications" DROP COLUMN "twitter_link";--> statement-breakpoint
ALTER TABLE "artist_applications" DROP COLUMN "tiktok_link";--> statement-breakpoint
ALTER TABLE "artist_applications" DROP COLUMN "set_length";--> statement-breakpoint
ALTER TABLE "artist_applications" DROP COLUMN "technical_requirements";