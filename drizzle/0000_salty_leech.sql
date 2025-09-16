-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "productType" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"price" numeric NOT NULL,
	"size" varchar(20),
	"color" varchar(255),
	"shortDescription" varchar NOT NULL,
	"sizePlaceHolder" varchar,
	"stock_quantity" numeric NOT NULL,
	"productId" varchar NOT NULL,
	"images" varchar[]
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" varchar(999) NOT NULL,
	"image" varchar(255) NOT NULL,
	"type" varchar NOT NULL,
	"page" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" text NOT NULL,
	"name" varchar(255),
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"surname" varchar(255),
	"type" varchar(255),
	CONSTRAINT "users_email_key" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"price" numeric NOT NULL,
	"email" varchar,
	"createDate" date DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"finalize_date" date,
	"payment_date" date,
	"status" varchar(255) NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"products" varchar[] NOT NULL,
	"orderDetails" varchar(999)
);

*/