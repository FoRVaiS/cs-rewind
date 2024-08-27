import { eq } from '@rewind/drizzle';
import { type UsersInsert, users } from '@rewind/drizzle/schema';

import { getDb } from '@rewind/express-api/globals';

export function addUser(email: string, password: string, salt: string) {
  const db = getDb();

  return db.insert(users).values({
    email,
    password,
    salt,
  } satisfies UsersInsert);
}

export function getUser(email: string) {
  const db = getDb();

  return db.query.users
    .findFirst({
      where: user => eq(user.email, email),
    });
}
