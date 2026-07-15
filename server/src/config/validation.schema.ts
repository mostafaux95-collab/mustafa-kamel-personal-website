import { z } from 'zod';

// Validated once at boot (see main.ts). Failing fast on a missing/malformed
// env var here is much cheaper than discovering it mid-request in prod.
export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),

  DATABASE_URL: z.string().min(1),
  REDIS_URL: z.string().min(1),

  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_ACCESS_TTL: z.string().min(1).default('15m'),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_REFRESH_TTL_DAYS: z.coerce.number().int().positive().default(30),

  COOKIE_SECRET: z.string().min(32),

  CORS_ORIGIN: z.string().min(1),

  SUPER_ADMIN_EMAIL: z.string().email(),
  SUPER_ADMIN_FIRST_NAME: z.string().min(1),
  SUPER_ADMIN_LAST_NAME: z.string().min(1),

  MAIL_TRANSPORT: z.enum(['console']).default('console'),
  MAIL_FROM: z.string().email(),

  APP_URL: z.string().min(1),
});

export type EnvConfig = z.infer<typeof envSchema>;

export function validateEnv(config: Record<string, unknown>): EnvConfig {
  const result = envSchema.safeParse(config);
  if (!result.success) {
    const formatted = result.error.issues
      .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
      .join('\n');
    throw new Error(`Invalid environment configuration:\n${formatted}`);
  }
  return result.data;
}
