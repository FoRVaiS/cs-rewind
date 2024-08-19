import express from 'express';
import z from 'zod';
import * as zErr from 'zod-validation-error';

import { sendResponse } from '../utils.js';

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 25;

export const pagination = (defaultPages: number, defaultLimits: number) => (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const { page, limit } = z.object({
      page: z.number({ coerce: true }).positive().int().min(1).default(defaultPages),
      limit: z.number({ coerce: true }).positive().int().min(1).default(defaultLimits),
    }).parse(req.query);

    req.page = page;
    req.limit = limit;

    next();
  } catch (e) {
    const err = e as z.ZodError;

    sendResponse(500, new Error(zErr.fromZodError(err).message))(req, res);
  }
};
