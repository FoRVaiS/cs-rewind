import { logger } from '@rewind/logger';
import { env } from '@rewind/env';
import { Api, Route } from '@rewind/express-api';

import * as v1 from './v1/index.js';

const HOST = env.API_HOST;
const PORT = env.API_PORT;

const routes: Route[] = [
  {
    path: '/api/v1',
    router: v1.createRoutes(),
  },
];

const api = new Api(routes, logger.info);
api.start(HOST, PORT);
