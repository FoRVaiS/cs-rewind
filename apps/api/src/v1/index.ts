import express from 'express';

import { use } from '@rewind/express-api/utils';

import { handleRegisterRequest, handleLoginRequest } from './user/user.controller.js';

export const createRoutes = () => {
  const router = express.Router();

  router.post('/user/register', use(handleRegisterRequest));
  router.post('/user/login', use(handleLoginRequest));

  return router;
};
