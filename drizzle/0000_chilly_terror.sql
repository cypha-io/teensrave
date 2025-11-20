CREATE TABLE "artist_applications" (
	"id" serial PRIMARY KEY NOT NULL,
	"artist_name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(50),
	"stage_name" varchar(255),
	"genre" varchar(100),
	"bio" text,
	"social_media" jsonb,
	"website" varchar(255),
	"spotify_link" varchar(255),
	"soundcloud_link" varchar(255),
	"youtube_link" varchar(255),
	"instagram_link" varchar(255),
	"facebook_link" varchar(255),
	"twitter_link" varchar(255),
	"tiktok_link" varchar(255),
	"performance_type" varchar(100),
	"set_length" varchar(50),
	"technical_requirements" text,
	"previous_performances" text,
	"motivation" text,
	"status" varchar(50) DEFAULT 'pending' NOT NULL,
	"submitted_at" timestamp DEFAULT now() NOT NULL,
	"reviewed_at" timestamp,
	"reviewer_notes" text
);
--> statement-breakpoint
CREATE TABLE "media_accreditation" (
	"id" serial PRIMARY KEY NOT NULL,
	"full_name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(50) NOT NULL,
	"media_outlet" varchar(255) NOT NULL,
	"media_type" varchar(100) NOT NULL,
	"portfolio_website" varchar(500) NOT NULL,
	"social_media_handles" text NOT NULL,
	"accreditation_category" varchar(100) NOT NULL,
	"previous_coverage" text NOT NULL,
	"interested_aspects" jsonb NOT NULL,
	"audience_reach" varchar(100) NOT NULL,
	"audience_description" text NOT NULL,
	"proof_of_work_url" varchar(500),
	"proof_of_work_file_name" varchar(255),
	"agreements_accepted" boolean DEFAULT false NOT NULL,
	"signature" varchar(255) NOT NULL,
	"status" varchar(50) DEFAULT 'pending' NOT NULL,
	"submitted_at" timestamp DEFAULT now() NOT NULL,
	"reviewed_at" timestamp,
	"reviewer_notes" text
);
--> statement-breakpoint
CREATE TABLE "news_articles" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(500) NOT NULL,
	"slug" varchar(500) NOT NULL,
	"content" text NOT NULL,
	"excerpt" text,
	"author" varchar(255),
	"category" varchar(100),
	"tags" jsonb,
	"featured_image" varchar(500),
	"is_published" boolean DEFAULT false NOT NULL,
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "news_articles_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "newsletter_subscribers" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"name" varchar(255),
	"subscribed_at" timestamp DEFAULT now() NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	CONSTRAINT "newsletter_subscribers_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "shop_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"price" numeric(10, 2) NOT NULL,
	"category" varchar(100),
	"image_url" varchar(500),
	"stock_quantity" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shop_orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"customer_name" varchar(255) NOT NULL,
	"customer_email" varchar(255) NOT NULL,
	"customer_phone" varchar(50),
	"items" jsonb NOT NULL,
	"total_amount" numeric(10, 2) NOT NULL,
	"status" varchar(50) DEFAULT 'pending' NOT NULL,
	"payment_method" varchar(50),
	"shipping_address" jsonb,
	"order_notes" text,
	"ordered_at" timestamp DEFAULT now() NOT NULL,
	"shipped_at" timestamp,
	"delivered_at" timestamp
);
