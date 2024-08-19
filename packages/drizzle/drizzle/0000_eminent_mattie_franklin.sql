CREATE TABLE IF NOT EXISTS "demos" (
	"id" char(64) PRIMARY KEY NOT NULL,
	"match_id" integer,
	"uploaded_on" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "matches" (
	"id" integer PRIMARY KEY NOT NULL,
	"played_on" timestamp NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"map" text NOT NULL,
	"mode" text,
	"rounds_played" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "player_records" (
	"match_id" integer NOT NULL,
	"steam_id" char(64) NOT NULL,
	CONSTRAINT "player_records_match_id_steam_id_pk" PRIMARY KEY("match_id","steam_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "players" (
	"steam_id" char(64) PRIMARY KEY NOT NULL
);
