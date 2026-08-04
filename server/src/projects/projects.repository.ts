import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { BaseRepository } from '../common/base/base.repository';
import type { ContentStatus, Prisma } from '../../generated/prisma/client';

export interface ListProjectsFilter {
  status?: ContentStatus;
  featured?: boolean;
  category?: string;
  search?: string;
  page: number;
  pageSize: number;
}

@Injectable()
export class ProjectsRepository extends BaseRepository<PrismaService['project']> {
  constructor(private readonly prisma: PrismaService) {
    super(prisma.project);
  }

  findBySlug(slug: string) {
    return this.findFirst({ where: { slug } });
  }

  async list(filter: ListProjectsFilter) {
    const where: Prisma.ProjectWhereInput = {
      ...(filter.status ? { status: filter.status } : {}),
      ...(filter.featured !== undefined ? { featured: filter.featured } : {}),
      ...(filter.category ? { category: filter.category } : {}),
      ...(filter.search
        ? {
            OR: [
              { title: { contains: filter.search, mode: 'insensitive' } },
              { titleAr: { contains: filter.search, mode: 'insensitive' } },
              { company: { contains: filter.search, mode: 'insensitive' } },
            ],
          }
        : {}),
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

  incrementViews(id: string) {
    return this.prisma.project.update({ where: { id }, data: { views: { increment: 1 } } });
  }

  // Applies a full new ordering in one transaction so the list is never
  // seen half-reordered by a concurrent read.
  reorder(ids: string[], actorId?: string) {
    return this.prisma.$transaction(
      ids.map((id, index) =>
        this.prisma.project.update({
          where: { id },
          data: { sortOrder: index, updatedById: actorId },
        }),
      ),
    );
  }
}
