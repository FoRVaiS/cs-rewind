import { promisify } from 'node:util';
import { pbkdf2, randomBytes } from 'node:crypto';

const pbkdf2Async = promisify(pbkdf2);

const SALT_BYTE_LENGTH = 16;
const PASSWORD_ENCRYPTION_ITERATIONS = 512 * (2 ** 10);

export async function encryptPassword(password: string): Promise<[password: string, salt: string]> {
  const salt = randomBytes(SALT_BYTE_LENGTH);
  const encryptedPasswordBuffer = await pbkdf2Async(password, salt, PASSWORD_ENCRYPTION_ITERATIONS, SALT_BYTE_LENGTH, 'sha256');

  return [encryptedPasswordBuffer.toString('hex'), salt.toString('hex')];
}
