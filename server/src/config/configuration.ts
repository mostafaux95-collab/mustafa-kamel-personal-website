import type { EnvConfig } from './validation.schema';

// Typed, structured view over the flat env-var namespace. Injected
// everywhere via @nestjs/config's ConfigService<AppConfig, true> rather
// than reading process.env directly in feature modules.
export interface AppConfig {
  nodeEnv: 'development' | 'test' | 'production';
  port: number;
  database: {
    url: string;
  };
  redis: {
    url: string | undefined;
  };
  jwt: {
    accessSecret: string;
    accessTtl: string;
    refreshSecret: string;
    refreshTtlDays: number;
  };
  cookieSecret: string;
  corsOrigin: string;
  superAdmin: {
    email: string;
    firstName: string;
    lastName: string;
  };
  mail: {
    transport: 'console';
    from: string;
  };
  appUrl: string;
  r2: {
    accountId: string | undefined;
    accessKeyId: string | undefined;
    secretAccessKey: string | undefined;
    bucketName: string | undefined;
    publicUrl: string | undefined;
  };
}

export default function configuration(): AppConfig {
  const env = process.env as unknown as EnvConfig;
  return {
    nodeEnv: env.NODE_ENV,
    port: Number(env.PORT),
    database: { url: env.DATABASE_URL },
    redis: { url: env.REDIS_URL },
    jwt: {
      accessSecret: env.JWT_ACCESS_SECRET,
      accessTtl: env.JWT_ACCESS_TTL,
      refreshSecret: env.JWT_REFRESH_SECRET,
      refreshTtlDays: Number(env.JWT_REFRESH_TTL_DAYS),
    },
    cookieSecret: env.COOKIE_SECRET,
    corsOrigin: env.CORS_ORIGIN,
    superAdmin: {
      email: env.SUPER_ADMIN_EMAIL,
      firstName: env.SUPER_ADMIN_FIRST_NAME,
      lastName: env.SUPER_ADMIN_LAST_NAME,
    },
    mail: {
      transport: env.MAIL_TRANSPORT,
      from: env.MAIL_FROM,
    },
    appUrl: env.APP_URL,
    r2: {
      accountId: env.R2_ACCOUNT_ID,
      accessKeyId: env.R2_ACCESS_KEY_ID,
      secretAccessKey: env.R2_SECRET_ACCESS_KEY,
      bucketName: env.R2_BUCKET_NAME,
      publicUrl: env.R2_PUBLIC_URL,
    },
  };
}
