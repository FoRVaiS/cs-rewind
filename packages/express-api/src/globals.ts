import { Client, connectToPostgres, migrate } from '@rewind/drizzle';
import { Client as MinioClient } from 'minio';
import { Redis } from 'ioredis';

let minio: MinioClient;
let db: Client;
let redis: Redis;

export function getMinio() {
  if (minio) return minio;

  throw new Error('Could not connect to Minio instance.');
}

export function connectMinio(host: string, port: number, username: string, password: string, ssl: boolean) {
  try {
    const _minio = getMinio();

    if (_minio) return _minio;
  } catch {
    minio = new MinioClient({
      endPoint: host,
      port,
      accessKey: username,
      secretKey: password,
      useSSL: ssl,
    });
  }

  return minio;
}

export function getDb() {
  if (db) return db;

  throw new Error('Could not connect to Database.');
}

export async function connectDrizzle(connectionString: string) {
  try {
    const _db = getDb();

    if (_db) return _db;
  } catch {
    db = await connectToPostgres(connectionString);
    await migrate(db);
  }

  return db;
}

export function getRedis() {
  if (redis) return redis;

  throw new Error('Could not connect to Redis instance.');
}

export async function connectRedis(connectionString: string) {
  try {
    const _redis = getRedis();

    if (_redis) return _redis;
  } catch {
    redis = new Redis(connectionString);
  }

  return redis;
}
