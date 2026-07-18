import { Injectable, NotFoundException } from '@nestjs/common';
import { LanguageRepository, type ListFilter } from './language.repository';
import { ContentStatus } from '../../generated/prisma/client';
import type { CreateLanguageDto } from './dto/create-language.dto';
import type { UpdateLanguageDto } from './dto/update-language.dto';

@Injectable()
export class LanguageService {
  constructor(private readonly repo: LanguageRepository) {}

  listPublic(query: Pick<ListFilter, 'page' | 'pageSize'>) {
    return this.repo.list({ ...query, status: ContentStatus.PUBLISHED });
  }

  listAdmin(query: ListFilter) {
    return this.repo.list(query);
  }

  async findByIdAdmin(id: string) {
    const item = await this.repo.findUnique({ where: { id } });
    if (!item || item.deletedAt) throw new NotFoundException('Language entry not found');
    return item;
  }

  create(dto: CreateLanguageDto, actorId: string) {
    return this.repo.create(dto, actorId);
  }

  async update(id: string, dto: UpdateLanguageDto, actorId: string) {
    await this.findByIdAdmin(id);
    return this.repo.update({ id }, dto, actorId);
  }

  async remove(id: string, actorId: string) {
    await this.findByIdAdmin(id);
    return this.repo.softDelete({ id }, actorId);
  }
}
