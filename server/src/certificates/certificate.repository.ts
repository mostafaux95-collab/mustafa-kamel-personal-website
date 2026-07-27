import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { BaseRepository } from '../common/base/base.repository';

export interface ListFilter {
  isVisible?: boolean;
  page: number;
  pageSize: number;
}

@Injectable()
export class CertificateRepository extends BaseRepository<PrismaService['certificate']> {
  constructor(private readonly prisma: PrismaService) {
    super(prisma.certificate);
  }

  async list(filter: ListFilter) {
    const where = filter.isVisible === undefined ? {} : { isVisible: filter.isVisible };

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

  // Applies a full new ordering in one transaction so the list is never
  // seen half-reordered by a concurrent read.
  reorder(ids: string[], actorId?: string) {
    return this.prisma.$transaction(
      ids.map((id, index) =>
        this.prisma.certificate.update({
          where: { id },
          data: { sortOrder: index, updatedById: actorId },
        }),
      ),
    );
  }
}
