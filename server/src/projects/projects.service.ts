import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { ProjectsRepository } from './projects.repository';
import { ContentStatus } from '../../generated/prisma/client';
import type { CreateProjectDto } from './dto/create-project.dto';
import type { UpdateProjectDto } from './dto/update-project.dto';
import type { ListProjectsDto } from './dto/list-projects.dto';

@Injectable()
export class ProjectsService {
  constructor(private readonly projectsRepository: ProjectsRepository) {}

  // Public surface: published only, never exposes drafts regardless of
  // what filters are requested.
  listPublic(query: Pick<ListProjectsDto, 'category' | 'page' | 'pageSize'>) {
    return this.projectsRepository.list({
      ...query,
      status: ContentStatus.PUBLISHED,
    });
  }

  async findBySlugPublic(slug: string) {
    const project = await this.projectsRepository.findBySlug(slug);
    if (!project || project.status !== ContentStatus.PUBLISHED) {
      throw new NotFoundException('Project not found');
    }
    await this.projectsRepository.incrementViews(project.id);
    return project;
  }

  // Admin surface: full filter set, including drafts.
  listAdmin(query: ListProjectsDto) {
    return this.projectsRepository.list(query);
  }

  async findByIdAdmin(id: string) {
    const project = await this.projectsRepository.findUnique({ where: { id } });
    if (!project || project.deletedAt) {
      throw new NotFoundException('Project not found');
    }
    return project;
  }

  async create(dto: CreateProjectDto, actorId: string) {
    const existing = await this.projectsRepository.findBySlug(dto.slug);
    if (existing) {
      throw new ConflictException('A project with this slug already exists');
    }
    return this.projectsRepository.create(dto, actorId);
  }

  async update(id: string, dto: UpdateProjectDto, actorId: string) {
    await this.findByIdAdmin(id);
    if (dto.slug) {
      const existing = await this.projectsRepository.findBySlug(dto.slug);
      if (existing && existing.id !== id) {
        throw new ConflictException('A project with this slug already exists');
      }
    }
    return this.projectsRepository.update({ id }, dto, actorId);
  }

  async remove(id: string, actorId: string) {
    await this.findByIdAdmin(id);
    return this.projectsRepository.softDelete({ id }, actorId);
  }
}
