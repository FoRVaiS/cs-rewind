import path from 'path';
import url from 'url';

import postgres from 'postgres';

import { sql } from 'drizzle-orm';
import { drizzle as pgDrizzle } from 'drizzle-orm/postgres-js';
import { migrate as pgMigrate } from 'drizzle-orm/postgres-js/migrator';

import * as schema from './models/schema.js';

export type Client = ReturnType<typeof pgDrizzle<typeof schema>>;
export const PgError = postgres.PostgresError;

const queryAutomaticUpdatedAt = sql`
  create or replace function on_row_update_set_updated_at() returns trigger
  language plpgsql as
    $$
    begin
      NEW."updated_at" = now();
      return NEW;
    end;
    $$;

  create or replace function on_create_table_add_trigger_on_row_update_set_updated_at() returns event_trigger
  language plpgsql as
    $$
      declare
        obj      record;
        tbl_name text;
      begin
        for obj in select * from pg_event_trigger_ddl_commands() where object_type = 'table'
          loop
            tbl_name := obj.objid::regclass;
            if exists(select 1
              from information_schema.columns
              where table_schema = obj.schema_name
                and table_name = tbl_name
                and column_name = 'updated_at') then
              execute format( 'create or replace trigger on_row_update_set_updated_at before update on %I for each row execute procedure on_row_update_set_updated_at();', tbl_name);
            end if;
          end loop;
      end
    $$;

  DO
    $$
      BEGIN
        create event trigger
          on_create_table_add_trigger_on_row_update_set_updated_at
          on ddl_command_end
          when tag in ('CREATE TABLE', 'CREATE TABLE AS')
        execute procedure on_create_table_add_trigger_on_row_update_set_updated_at();
      EXCEPTION
       WHEN duplicate_object THEN NULL;
      END;
    $$;
`;

export const connectToPostgres = async (connectionString: string) => {
  const client = postgres(connectionString, { max: 1, onnotice: () => { } });
  const db = pgDrizzle(client, { schema });

  /** Automatically updates every `updated_at` column when a row is modified*/
  await db.execute(queryAutomaticUpdatedAt);

  return db;
};

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const _migrationFolder = path.join(__dirname, '..', 'drizzle');

export const migrate = async (db: Client) => pgMigrate(db, { migrationsFolder: _migrationFolder });

export * as schema from './models/schema.js';
export * from 'drizzle-orm';
