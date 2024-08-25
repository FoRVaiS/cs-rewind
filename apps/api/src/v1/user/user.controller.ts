import express from 'express';
import z from 'zod';

import { ApiError } from '@rewind/express-api/errors';
import { PgError } from '@rewind/drizzle';

import { encryptPassword } from './user.service.js';
import { addUser } from './user.model.js';

const registerBodyValidator = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function handleRegisterRequest(req: express.Request) {
  const { email, password } = registerBodyValidator.parse(req.body);

  const [hashedPassword, salt] = await encryptPassword(password);

  try {
    await addUser(email, hashedPassword, salt);

    return 'OK!';
  } catch (e) {
    if (e instanceof PgError) {
      const code = Number(e.code);

      if (code === 23505) return new ApiError(`"${email}" already exists.`, 409);
    }

    if (e instanceof ApiError) return e;

    return new ApiError('Internal Server Error', 500);
  }
}
