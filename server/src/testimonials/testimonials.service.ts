import { Injectable, NotFoundException } from '@nestjs/common';
import { TestimonialsRepository, type ListFilter } from './testimonials.repository';
import { ContentStatus } from '../../generated/prisma/client';
import type { CreateTestimonialDto } from './dto/create-testimonial.dto';
import type { UpdateTestimonialDto } from './dto/update-testimonial.dto';

@Injectable()
export class TestimonialsService {
  constructor(private readonly repo: TestimonialsRepository) {}

  listPublic(query: Pick<ListFilter, 'page' | 'pageSize'>) {
    return this.repo.list({ ...query, status: ContentStatus.PUBLISHED });
  }

  listAdmin(query: ListFilter) {
    return this.repo.list(query);
  }

  async findByIdAdmin(id: string) {
    const item = await this.repo.findUnique({ where: { id } });
    if (!item || item.deletedAt) throw new NotFoundException('Testimonial not found');
    return item;
  }

  create(dto: CreateTestimonialDto, actorId: string) {
    return this.repo.create(dto, actorId);
  }

  async update(id: string, dto: UpdateTestimonialDto, actorId: string) {
    await this.findByIdAdmin(id);
    return this.repo.update({ id }, dto, actorId);
  }

  async remove(id: string, actorId: string) {
    await this.findByIdAdmin(id);
    return this.repo.softDelete({ id }, actorId);
  }
}
