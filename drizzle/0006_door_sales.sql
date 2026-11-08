ALTER TABLE "ticket_sales" ADD COLUMN "client_ref" varchar(64);--> statement-breakpoint
ALTER TABLE "ticket_sales" ADD COLUMN "receipt_code" varchar(32);--> statement-breakpoint
ALTER TABLE "ticket_sales" ADD COLUMN "device_label" varchar(60);--> statement-breakpoint
ALTER TABLE "ticket_sales" ADD COLUMN "sold_by" varchar(255);--> statement-breakpoint
ALTER TABLE "ticket_sales" ADD COLUMN "sold_at" timestamp;--> statement-breakpoint
ALTER TABLE "ticket_sales" ADD CONSTRAINT "ticket_sales_client_ref_unique" UNIQUE("client_ref");