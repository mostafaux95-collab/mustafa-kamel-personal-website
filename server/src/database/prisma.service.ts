import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/prisma/client';
import type { AppConfig } from '../config/configuration';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor(config: ConfigService<AppConfig, true>) {
    // Prisma 7 requires an explicit driver adapter (no more implicit
    // connection from the schema's datasource block).
    super({
      adapter: new PrismaPg(config.get('database.url', { infer: true })),
      log: [
        { emit: 'event', level: 'error' },
        { emit: 'event', level: 'warn' },
      ],
    });
  }

  async onModuleInit() {
    // @ts-expect-error -- Prisma's event-based $on typing isn't picked up
    // automatically from the constructor log config above.
    this.$on('error', (e: unknown) => this.logger.error(e));
    // @ts-expect-error -- see above.
    this.$on('warn', (e: unknown) => this.logger.warn(e));
    await this.$connect();
    this.logger.log('Connected to PostgreSQL via Prisma');
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
