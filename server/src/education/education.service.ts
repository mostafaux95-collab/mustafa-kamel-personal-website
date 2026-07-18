import { Injectable, NotFoundException } from '@nestjs/common';
import { EducationRepository, type ListFilter } from './education.repository';
import { ContentStatus } from '../../generated/prisma/client';
import type { CreateEducationDto } from './dto/create-education.dto';
import type { UpdateEducationDto } from './dto/update-education.dto';

@Injectable()
export class EducationService {
  constructor(private readonly repo: EducationRepository) {}

  listPublic(query: Pick<ListFilter, 'page' | 'pageSize'>) {
    return this.repo.list({ ...query, status: ContentStatus.PUBLISHED });
  }

  listAdmin(query: ListFilter) {
    return this.repo.list(query);
  }

  async findByIdAdmin(id: string) {
    const item = await this.repo.findUnique({ where: { id } });
    if (!item || item.deletedAt) throw new NotFoundException('Education entry not found');
    return item;
  }

  create(dto: CreateEducationDto, actorId: string) {
    return this.repo.create(dto, actorId);
  }

  async update(id: string, dto: UpdateEducationDto, actorId: string) {
    await this.findByIdAdmin(id);
    return this.repo.update({ id }, dto, actorId);
  }

  async remove(id: string, actorId: string) {
    await this.findByIdAdmin(id);
    return this.repo.softDelete({ id }, actorId);
  }
}
