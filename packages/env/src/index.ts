import z from 'zod';

const NODE_ENV_OPTIONS = ['production', 'development'] as const;
const DEFAULT_NODE_ENV: typeof NODE_ENV_OPTIONS[number] = 'production';

const DEFAULT_HOST = '0.0.0.0';

const DEFAULT_API_HOST = DEFAULT_HOST;
const DEFAULT_API_PORT = 3000;

const DEFAULT_DEMO_SCRAPER_HOST = DEFAULT_HOST;
const DEFAULT_DEMO_SCRAPER_PORT = 3001;

const DEFAULT_FRONTEND_HOST = DEFAULT_HOST;
const DEFAULT_FRONTEND_PORT = 8080;

const DEFAULT_POSTGRES_HOST = DEFAULT_HOST;
const DEFAULT_POSTGRES_PORT = 5432;

const DEFAULT_REDIS_HOST = DEFAULT_HOST;
const DEFAULT_REDIS_PORT = 6379;
const DEFAULT_REDIS_CONSOLE_PORT = 6380;
const DEFAULT_REDIS_DATABASE = '0';

const DEFAULT_MINIO_HOST = DEFAULT_HOST;
const DEFAULT_MINIO_PORT = 9000;
const DEFAULT_MINIO_CONSOLE_PORT = 9001;
const DEFAULT_MINIO_SSL = false;
const DEFAULT_MINIO_BUCKET_DEMOS = 'demos';

const envSchema = z.object({
  NODE_ENV: z.enum(NODE_ENV_OPTIONS).default(DEFAULT_NODE_ENV),

  API_HOST: z.string().url().or(z.string().ip()).default(DEFAULT_API_HOST),
  API_PORT: z.number({ coerce: true }).default(DEFAULT_API_PORT),

  DEMO_SCRAPER_HOST: z.string().url().or(z.string().ip()).default(DEFAULT_DEMO_SCRAPER_HOST),
  DEMO_SCRAPER_PORT: z.number({ coerce: true }).default(DEFAULT_DEMO_SCRAPER_PORT),

  FRONTEND_HOST: z.string().url().or(z.string().ip()).default(DEFAULT_FRONTEND_HOST),
  FRONTEND_PORT: z.number({ coerce: true }).default(DEFAULT_FRONTEND_PORT),

  POSTGRES_HOST: z.string().default(DEFAULT_POSTGRES_HOST),
  POSTGRES_PORT: z.number({ coerce: true }).default(DEFAULT_POSTGRES_PORT),
  POSTGRES_USER: z.string().optional(),
  POSTGRES_PASSWORD: z.string().optional(),
  POSTGRES_DATABASE: z.string().optional(),
  POSTGRES_SESSION_DATABASE: z.string().optional(),

  REDIS_HOST: z.string().default(DEFAULT_REDIS_HOST),
  REDIS_PORT: z.number({ coerce: true }).default(DEFAULT_REDIS_PORT),
  REDIS_CONSOLE_PORT: z.number({ coerce: true }).default(DEFAULT_REDIS_CONSOLE_PORT),
  REDIS_USER: z.string().optional(),
  REDIS_PASSWORD: z.string().optional(),
  REDIS_DATABASE: z.string().default(DEFAULT_REDIS_DATABASE),

  MINIO_HOST: z.string().default(DEFAULT_MINIO_HOST),
  MINIO_PORT: z.number({ coerce: true }).default(DEFAULT_MINIO_PORT),
  MINIO_CONSOLE_PORT: z.number({ coerce: true }).default(DEFAULT_MINIO_CONSOLE_PORT),
  MINIO_SSL: z.boolean().default(DEFAULT_MINIO_SSL),
  MINIO_USER: z.string().optional(),
  MINIO_PASSWORD: z.string().optional(),
  MINIO_BUCKET_DEMOS: z.string().default(DEFAULT_MINIO_BUCKET_DEMOS),

  SESSION_SECRET: z.string().optional(),
});

export const env = envSchema.parse(process.env);

export const POSTGRES_CONNECTION_STRING = `postgresql://${env.POSTGRES_USER}:${env.POSTGRES_PASSWORD}@${env.POSTGRES_HOST}:${env.POSTGRES_PORT}/${env.POSTGRES_DATABASE}`;
export const REDIS_CONNECTION_STRING_UNSECURE = `redis://${env.REDIS_USER}:${env.REDIS_PASSWORD}@${env.REDIS_HOST}:${env.REDIS_PORT}/${env.REDIS_DATABASE}`;
export const REDIS_CONNECTION_STRING_SECURE = `rediss://${env.REDIS_USER}:${env.REDIS_PORT}@${env.REDIS_HOST}:${env.REDIS_PORT}/${env.REDIS_DATABASE}`;
export const IS_DEV = env.NODE_ENV === 'development';
