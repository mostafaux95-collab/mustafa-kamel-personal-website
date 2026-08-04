import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ListProjectsDto } from './dto/list-projects.dto';
import { ReorderProjectsDto } from './dto/reorder-projects.dto';
import { RequirePermissions } from '../common/decorators/permissions.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../common/types/auth.types';

@ApiTags('Projects (admin)')
@ApiBearerAuth()
@Controller('admin/projects')
export class ProjectsAdminController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  @RequirePermissions('projects:read')
  list(@Query() query: ListProjectsDto) {
    return this.projectsService.listAdmin(query);
  }

  @Get(':id')
  @RequirePermissions('projects:read')
  findOne(@Param('id') id: string) {
    return this.projectsService.findByIdAdmin(id);
  }

  @Post()
  @RequirePermissions('projects:write')
  create(@Body() dto: CreateProjectDto, @CurrentUser() actor: AuthenticatedUser) {
    return this.projectsService.create(dto, actor.id);
  }

  // Registered before ':id' so Nest doesn't try to match "reorder" as an id.
  @Patch('reorder')
  @RequirePermissions('projects:write')
  reorder(@Body() dto: ReorderProjectsDto, @CurrentUser() actor: AuthenticatedUser) {
    return this.projectsService.reorder(dto.ids, actor.id);
  }

  @Patch(':id')
  @RequirePermissions('projects:write')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateProjectDto,
    @CurrentUser() actor: AuthenticatedUser,
  ) {
    return this.projectsService.update(id, dto, actor.id);
  }

  @Delete(':id')
  @RequirePermissions('projects:write')
  remove(@Param('id') id: string, @CurrentUser() actor: AuthenticatedUser) {
    return this.projectsService.remove(id, actor.id);
  }
}
