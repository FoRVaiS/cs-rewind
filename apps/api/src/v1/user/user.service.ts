import { promisify } from 'node:util';
import { pbkdf2, randomBytes, timingSafeEqual } from 'node:crypto';

const pbkdf2Async = promisify(pbkdf2);

const SALT_BYTE_LENGTH = 16;
const PASSWORD_ENCRYPTION_ITERATIONS = 512 * (2 ** 10);

export async function encryptPassword(password: string, salt?: string): Promise<[password: string, salt: string]> {
  const _salt = salt ? Buffer.from(salt, 'hex') : randomBytes(SALT_BYTE_LENGTH);

  const encryptedPasswordBuffer = await pbkdf2Async(password, _salt, PASSWORD_ENCRYPTION_ITERATIONS, SALT_BYTE_LENGTH, 'sha256');

  return [encryptedPasswordBuffer.toString('hex'), _salt.toString('hex')];
}

export function comparePasswords(passwordA: string, passwordB: string) {
  return timingSafeEqual(Buffer.from(passwordA, 'hex'), Buffer.from(passwordB, 'hex'));
}

export async function login(password: string, salt: string, passwordValidator: (password: string) => boolean) {
  const [hashedPassword] = await encryptPassword(password, salt);

  return passwordValidator(hashedPassword);
}
