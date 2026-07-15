import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import type { Prisma } from '../../generated/prisma/client';

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  list() {
    return this.prisma.siteSetting.findMany({ orderBy: { key: 'asc' } });
  }

  async upsert(key: string, value: unknown, actorId: string) {
    return this.prisma.siteSetting.upsert({
      where: { key },
      create: { key, value: value as Prisma.InputJsonValue, updatedById: actorId },
      update: { value: value as Prisma.InputJsonValue, updatedById: actorId },
    });
  }
}
