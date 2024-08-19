import { pgTable, integer, timestamp, primaryKey, text, char, doublePrecision } from 'drizzle-orm/pg-core';
import { relations, InferInsertModel, InferSelectModel } from 'drizzle-orm';

export const CS_GAME_MODES = ['premier', 'competitive', 'wingman'] as const;
export const CS_DEMO_SOURCES = ['VALVE', 'FACEIT'] as const;

export const players = pgTable('players', {
  /** PRIMARY KEY/STEAMID64 */
  id: char('player_steam_id', { length: 64 }).primaryKey(),
});

export const playerRecords = pgTable('player_records', {
  /** FOREIGN KEY */
  matchId: integer('match_id').notNull(),

  /** FOREIGN KEY/STEAMID64 */
  playerId: char('player_steam_id', { length: 64 }).notNull(),

  // TODO: Add player performance details...
  leetifyRating: doublePrecision('leetify_rating'),

  kills: integer('kills').notNull(),
  assists: integer('assists').notNull(),
  deaths: integer('deaths').notNull(),

  // Grenade Statistics
  enemiesFlashed: integer('enemies_flashed').notNull(),
  damageExplosive: integer('damage_explosive').notNull(),
  damageFire: integer('damage_fire').notNull(),
}, table => ({
  pk: primaryKey({ columns: [table.matchId, table.playerId] }),
}));

export const matches = pgTable('matches', {
  /** PRIMARY KEY/Auto-Generated */
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),

  playedOn: timestamp('played_on').notNull(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  map: text('map').notNull(),
  mode: text('mode', { enum: CS_GAME_MODES }),
  roundsPlayed: integer('rounds_played'),
});

export const demos = pgTable('demos', {
  /** PRIMARY KEY/The demo id is computed by hashing the demo file with the SHA256 hash algorithm. */
  id: char('id', { length: 64 }).primaryKey(),

  /** FOREIGN KEY/STEAMID64 */
  matchId: integer('match_id'),

  source: text('source', { enum: CS_DEMO_SOURCES }),
  uploadedOn: timestamp('uploaded_on').defaultNow(),
});

export const matchDemoRelation = relations(demos, ({ one }) => ({
  match: one(matches, {
    fields: [demos.matchId],
    references: [matches.id],
  }),
}));

export const playerRecordRelation = relations(playerRecords, ({ one }) => ({
  player: one(players, {
    fields: [playerRecords.playerId],
    references: [players.id],
  }),

  match: one(matches, {
    fields: [playerRecords.matchId],
    references: [matches.id],
  }),
}));

export type PlayersInsert = InferInsertModel<typeof players>;
export type PlayersSelect = InferSelectModel<typeof players>;
export type PlayerRecordsInsert = InferInsertModel<typeof playerRecords>;
export type PlayerRecordsSelect = InferSelectModel<typeof playerRecords>;
export type MatchesInsert = InferInsertModel<typeof matches>;
export type MatchesSelect = InferSelectModel<typeof matches>;
export type DemosInsert = InferInsertModel<typeof demos>;
export type DemosSelect = InferSelectModel<typeof demos>;
