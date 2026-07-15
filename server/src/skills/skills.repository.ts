import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { BaseRepository } from '../common/base/base.repository';
import type { ContentStatus } from '../../generated/prisma/client';

export interface ListFilter {
  status?: ContentStatus;
  category?: string;
  page: number;
  pageSize: number;
}

@Injectable()
export class SkillsRepository extends BaseRepository<PrismaService['skill']> {
  constructor(private readonly prisma: PrismaService) {
    super(prisma.skill);
  }

  async list(filter: ListFilter) {
    const where = {
      ...(filter.status ? { status: filter.status } : {}),
      ...(filter.category ? { category: filter.category } : {}),
    };

    const [items, total] = await Promise.all([
      this.findMany({
        where,
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
        skip: (filter.page - 1) * filter.pageSize,
        take: filter.pageSize,
      }),
      this.count({ where }),
    ]);

    return { items, total };
  }
}
