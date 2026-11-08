CREATE TABLE "pos_tellers" (
	"id" serial PRIMARY KEY NOT NULL,
	"member_id" integer NOT NULL,
	"tickets_allocated" integer DEFAULT 0 NOT NULL,
	"admit_limit" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "pos_tellers_member_id_unique" UNIQUE("member_id")
);
--> statement-breakpoint
ALTER TABLE "pos_tellers" ADD CONSTRAINT "pos_tellers_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE cascade ON UPDATE no action;