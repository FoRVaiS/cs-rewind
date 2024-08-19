import { defineConfig } from 'drizzle-kit';

import { POSTGRES_CONNECTION_STRING } from '@rewind/env';

export default defineConfig({
  schema: './src/models/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: POSTGRES_CONNECTION_STRING,
  },
});
