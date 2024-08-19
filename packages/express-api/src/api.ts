import express from 'express';

// Middleware
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { pagination, DEFAULT_PAGE, DEFAULT_LIMIT } from './middleware/PaginationMiddleware.js';

import { env, IS_DEV } from '@rewind/env';

import { ApiRouteNotFound } from './errors/ApiRouteNotFound.js';
import { use } from './utils.js';

export type Route = {
  path: string,
  router: express.Router
}

export class Api {
  public readonly app: express.Application;
  private server: ReturnType<express.Application['listen']> | null = null;

  constructor(routes: Route[], private readonly writeStream: (msg: string) => void = console.log) {
    this.app = express();

    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(morgan(IS_DEV ? 'dev' : 'combined', {
      stream: {
        write: (msg: string) => writeStream(msg.trim()),
      },
    }));

    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    //
    // Set a default page and limit, if the user fails to provide either
    this.app.use(pagination(DEFAULT_PAGE, DEFAULT_LIMIT));

    for (const route of routes) {
      this.app.use(route.path, route.router);
    }

    this.app.get('/healthz', use(() => 'OK!'));
    this.app.all('*', use((req: express.Request) => new ApiRouteNotFound(req.url)));
  }

  public start(host: string, port: number, cb?: () => void) {
    const defaultCb = () => {
      this.writeStream(`Listening on http://${host}:${port} in ${env.NODE_ENV} mode.`);
    };

    this.server = this.app.listen(port, host, cb || defaultCb);
  }

  public stop() {
    if (this.server) this.server.close();
  }
}
