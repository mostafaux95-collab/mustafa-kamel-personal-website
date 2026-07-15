import { Injectable, NotFoundException } from '@nestjs/common';
import { SkillsRepository, type ListFilter } from './skills.repository';
import { ContentStatus } from '../../generated/prisma/client';
import type { CreateSkillDto } from './dto/create-skill.dto';
import type { UpdateSkillDto } from './dto/update-skill.dto';

@Injectable()
export class SkillsService {
  constructor(private readonly repo: SkillsRepository) {}

  listPublic(query: Pick<ListFilter, 'category' | 'page' | 'pageSize'>) {
    return this.repo.list({ ...query, status: ContentStatus.PUBLISHED });
  }

  listAdmin(query: ListFilter) {
    return this.repo.list(query);
  }

  async findByIdAdmin(id: string) {
    const item = await this.repo.findUnique({ where: { id } });
    if (!item || item.deletedAt) throw new NotFoundException('Skill not found');
    return item;
  }

  create(dto: CreateSkillDto, actorId: string) {
    return this.repo.create(dto, actorId);
  }

  async update(id: string, dto: UpdateSkillDto, actorId: string) {
    await this.findByIdAdmin(id);
    return this.repo.update({ id }, dto, actorId);
  }

  async remove(id: string, actorId: string) {
    await this.findByIdAdmin(id);
    return this.repo.softDelete({ id }, actorId);
  }
}
