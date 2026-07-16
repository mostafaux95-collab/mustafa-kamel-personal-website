import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { BaseRepository } from '../common/base/base.repository';

export interface ListFilter {
  folder?: string;
  search?: string;
  page: number;
  pageSize: number;
}

@Injectable()
export class MediaRepository extends BaseRepository<PrismaService['mediaAsset']> {
  constructor(private readonly prisma: PrismaService) {
    super(prisma.mediaAsset);
  }

  // Hard delete — an orphaned file on disk with no DB row is just wasted
  // space, but a soft-deleted row pointing at a file we've unlinked would
  // be a dangling reference forever.
  hardDelete(id: string) {
    return this.prisma.mediaAsset.delete({ where: { id } });
  }

  async list(filter: ListFilter) {
    const where = {
      ...(filter.folder ? { folder: filter.folder } : {}),
      ...(filter.search
        ? { originalName: { contains: filter.search, mode: 'insensitive' as const } }
        : {}),
    };

    const [items, total] = await Promise.all([
      this.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (filter.page - 1) * filter.pageSize,
        take: filter.pageSize,
      }),
      this.count({ where }),
    ]);

    return { items, total };
  }
}
