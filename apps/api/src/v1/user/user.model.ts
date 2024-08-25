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
