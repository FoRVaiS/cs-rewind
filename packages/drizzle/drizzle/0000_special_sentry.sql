CREATE TABLE IF NOT EXISTS "demos" (
	"id" char(64) PRIMARY KEY NOT NULL,
	"match_id" integer,
	"source" text,
	"uploaded_on" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "matches" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "matches_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"played_on" timestamp NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"map" text NOT NULL,
	"mode" text,
	"rounds_played" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "player_records" (
	"match_id" integer NOT NULL,
	"player_steam_id" char(64) NOT NULL,
	"leetify_rating" double precision,
	"kills" integer NOT NULL,
	"assists" integer NOT NULL,
	"deaths" integer NOT NULL,
	"enemies_flashed" integer NOT NULL,
	"damage_explosive" integer NOT NULL,
	"damage_fire" integer NOT NULL,
	CONSTRAINT "player_records_match_id_player_steam_id_pk" PRIMARY KEY("match_id","player_steam_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "players" (
	"player_steam_id" char(64) PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"email" text NOT NULL,
	"password" text NOT NULL,
	"salt" text NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
