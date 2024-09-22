import express from 'express';

import { use } from '@rewind/express-api/utils';

import { handleRegisterRequest, handleLoginRequest } from './user/user.controller.js';

declare module 'express-session' {
  interface SessionData { }
}

export const createRoutes = () => {
  const router = express.Router();

  router.post('/user/register', use(handleRegisterRequest));
  router.post('/user/login', use(handleLoginRequest));

  return router;
};
