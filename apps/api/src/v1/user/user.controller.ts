import express from 'express';
import z, { ZodError } from 'zod';

import { ApiError } from '@rewind/express-api/errors';
import { ERROR_UNKNOWN, ERROR_INVALID_EMAIL_FORMAT, ERROR_INVALID_PASSWORD_FORMAT, ERROR_ACCOUNT_ALREADY_EXISTS, ERROR_INVALID_CREDENTIALS } from '@rewind/error-codes';
import { raise, raiseApi } from '@rewind/express-api/utils';
import { PgError } from '@rewind/drizzle';

import { encryptPassword, comparePasswords, login } from './user.service.js';
import { addUser, getUser } from './user.model.js';

const credentialsValidator = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const loginCredentialsValidator = credentialsValidator.extend({
  password: z.string(), // Do not care if the user does not meet length requirements, it is wrong anyways.
});

export async function handleRegisterRequest(req: express.Request) {
  const { email, password } = credentialsValidator.parse(req.body);

  const [hashedPassword, salt] = await encryptPassword(password);

  try {
    await addUser(email, hashedPassword, salt);

    return 'OK!';
  } catch (e) {
    if (e instanceof PgError) {
      const code = Number(e.code);

      if (code === 23505) return new ApiError(`"${email}" already exists.`, ERROR_ACCOUNT_ALREADY_EXISTS, 409);
    }

    if (e instanceof ApiError) return e;

    return new ApiError('Internal Server Error', ERROR_UNKNOWN, 500);
  }
}

export async function handleLoginRequest(req: express.Request) {
  try {
    const { email, password } = loginCredentialsValidator.parse(req.body);

    const user = (await getUser(email)) ?? raiseApi(`User ${email} does not exist.`, ERROR_INVALID_CREDENTIALS, 404);
    const passwordValidator = comparePasswords.bind(null, user.password);

    const authenticated = await login(password, user.salt, passwordValidator);
    if (!authenticated) return new ApiError('Incorrect email or password', ERROR_INVALID_CREDENTIALS, 401);

    return 'OK!';
  } catch (e) {
    if (e instanceof ApiError) return e;

    if (e instanceof ZodError) {
      const error = e.issues[0] ?? raise('ZodError was raised but could find the first ZodIssue');

      const { code } = error;
      const path = error.path[0] ?? raise('Could not find offending key');

      if (path === 'email' && code === 'invalid_type') return new ApiError('The email address provided is not valid.', ERROR_INVALID_EMAIL_FORMAT, 400); // Missing "email" in body
      if (path === 'email' && code === 'invalid_string') return new ApiError('Please enter a valid email address format.', ERROR_INVALID_EMAIL_FORMAT, 400); // Bad email format

      if (path === 'password' && code === 'invalid_type') return new ApiError('The password provided is not valid.', ERROR_INVALID_PASSWORD_FORMAT, 400); // Missing "password" in body
    }

    return new ApiError('Internal Server Error', ERROR_UNKNOWN, 500);
  }
}
