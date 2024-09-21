import expressSession from 'express-session';

import { logger } from '@rewind/logger';
import { env } from '@rewind/env';
import { createApi, Route } from '@rewind/express-api';
import { connectDrizzle } from '@rewind/express-api/globals';
import { raise } from '@rewind/express-api/utils';

import { createSessionStore } from './globals.js';
import * as v1 from './v1/index.js';

/* ====== DATABASE ====== */
const { POSTGRES_HOST, POSTGRES_PORT, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DATABASE } = env;
const connectionString = `postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DATABASE}`;
await connectDrizzle(connectionString);

/* ====== SESSIONS ====== */
const { POSTGRES_SESSION_DATABASE, SESSION_SECRET } = env;
const sessionConnectionString = `postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_SESSION_DATABASE}`;
const sessionDbName = POSTGRES_SESSION_DATABASE ?? raise('Provide a name for the sessions database using the "POSTGRES_SESSION_DATABASE" environment variable.');
const store = createSessionStore(sessionConnectionString, sessionDbName);

/* ===== API ===== */
const HOST = env.API_HOST;
const PORT = env.API_PORT;

const routes: Route[] = [
  {
    path: '/api/v1',
    router: v1.createRoutes(),
  },
];

const Api = createApi(app => {
  app.set('trust proxy', 1);

  app.use(expressSession({
    store,
    secret: SESSION_SECRET ?? raise('You must provide a session secret using the "SESSION_SECRET" environment variable.'),
    resave: false,
    saveUninitialized: true,
  }));
});

const api = new Api(routes, logger.info);
api.start(HOST, PORT);
