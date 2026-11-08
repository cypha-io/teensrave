CREATE TABLE "pos_teller_tickets" (
	"id" serial PRIMARY KEY NOT NULL,
	"member_id" integer NOT NULL,
	"ticket_type_id" integer NOT NULL,
	"ticket_limit" integer NOT NULL,
	CONSTRAINT "pos_teller_tickets_pair" UNIQUE("member_id","ticket_type_id")
);
--> statement-breakpoint
ALTER TABLE "pos_teller_tickets" ADD CONSTRAINT "pos_teller_tickets_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pos_teller_tickets" ADD CONSTRAINT "pos_teller_tickets_ticket_type_id_ticket_types_id_fk" FOREIGN KEY ("ticket_type_id") REFERENCES "public"."ticket_types"("id") ON DELETE cascade ON UPDATE no action;