import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { BaseRepository } from '../common/base/base.repository';

export interface ListContactMessagesFilter {
  isRead?: boolean;
  page: number;
  pageSize: number;
}

@Injectable()
export class ContactRepository extends BaseRepository<PrismaService['contactMessage']> {
  constructor(private readonly prisma: PrismaService) {
    super(prisma.contactMessage);
  }

  async list(filter: ListContactMessagesFilter) {
    const where = {
      ...(filter.isRead !== undefined ? { isRead: filter.isRead } : {}),
    };

    const [items, total, unread] = await Promise.all([
      this.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (filter.page - 1) * filter.pageSize,
        take: filter.pageSize,
      }),
      this.count({ where }),
      this.count({ where: { isRead: false } }),
    ]);

    return { items, total, unread };
  }
}
