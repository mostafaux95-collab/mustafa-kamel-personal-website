import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { BaseRepository } from '../common/base/base.repository';
import type { ContentStatus } from '../../generated/prisma/client';

export interface ListFilter {
  status?: ContentStatus;
  featured?: boolean;
  page: number;
  pageSize: number;
}

@Injectable()
export class ClientsRepository extends BaseRepository<PrismaService['client']> {
  constructor(private readonly prisma: PrismaService) {
    super(prisma.client);
  }

  async list(filter: ListFilter) {
    const where = {
      ...(filter.status ? { status: filter.status } : {}),
      ...(filter.featured !== undefined ? { featured: filter.featured } : {}),
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
