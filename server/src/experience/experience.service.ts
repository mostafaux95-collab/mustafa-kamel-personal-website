import { Injectable, NotFoundException } from '@nestjs/common';
import { ExperienceRepository, type ListFilter } from './experience.repository';
import { ContentStatus } from '../../generated/prisma/client';
import type { CreateExperienceDto } from './dto/create-experience.dto';
import type { UpdateExperienceDto } from './dto/update-experience.dto';

@Injectable()
export class ExperienceService {
  constructor(private readonly repo: ExperienceRepository) {}

  listPublic(query: Pick<ListFilter, 'page' | 'pageSize'>) {
    return this.repo.list({ ...query, status: ContentStatus.PUBLISHED });
  }

  listAdmin(query: ListFilter) {
    return this.repo.list(query);
  }

  async findByIdAdmin(id: string) {
    const item = await this.repo.findUnique({ where: { id } });
    if (!item || item.deletedAt) throw new NotFoundException('Experience not found');
    return item;
  }

  create(dto: CreateExperienceDto, actorId: string) {
    return this.repo.create(dto, actorId);
  }

  async update(id: string, dto: UpdateExperienceDto, actorId: string) {
    await this.findByIdAdmin(id);
    return this.repo.update({ id }, dto, actorId);
  }

  async remove(id: string, actorId: string) {
    await this.findByIdAdmin(id);
    return this.repo.softDelete({ id }, actorId);
  }
}
