import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Projects (public)')
@Public()
@Controller('projects')
export class ProjectsPublicController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  list(@Query('category') category?: string, @Query('page') page = '1', @Query('pageSize') pageSize = '20') {
    return this.projectsService.listPublic({
      category,
      page: Number(page),
      pageSize: Number(pageSize),
    });
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.projectsService.findBySlugPublic(slug);
  }
}
