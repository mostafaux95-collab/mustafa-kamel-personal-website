import { Injectable, NotFoundException } from '@nestjs/common';
import { CertificateRepository, type ListFilter } from './certificate.repository';
import type { CreateCertificateDto } from './dto/create-certificate.dto';
import type { UpdateCertificateDto } from './dto/update-certificate.dto';

@Injectable()
export class CertificateService {
  constructor(private readonly repo: CertificateRepository) {}

  listPublic(query: Pick<ListFilter, 'page' | 'pageSize'>) {
    return this.repo.list({ ...query, isVisible: true });
  }

  listAdmin(query: ListFilter) {
    return this.repo.list(query);
  }

  async findByIdAdmin(id: string) {
    const item = await this.repo.findUnique({ where: { id } });
    if (!item || item.deletedAt) throw new NotFoundException('Certificate not found');
    return item;
  }

  create(dto: CreateCertificateDto, actorId: string) {
    return this.repo.create(dto, actorId);
  }

  async update(id: string, dto: UpdateCertificateDto, actorId: string) {
    await this.findByIdAdmin(id);
    return this.repo.update({ id }, dto, actorId);
  }

  async remove(id: string, actorId: string) {
    await this.findByIdAdmin(id);
    return this.repo.softDelete({ id }, actorId);
  }

  reorder(ids: string[], actorId: string) {
    return this.repo.reorder(ids, actorId);
  }
}
