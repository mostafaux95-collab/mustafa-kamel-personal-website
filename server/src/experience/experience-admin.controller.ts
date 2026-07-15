import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ExperienceService } from './experience.service';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import { ListExperienceDto } from './dto/list-experience.dto';
import { RequirePermissions } from '../common/decorators/permissions.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../common/types/auth.types';

@ApiTags('Experience (admin)')
@ApiBearerAuth()
@Controller('admin/experience')
export class ExperienceAdminController {
  constructor(private readonly service: ExperienceService) {}

  @Get()
  @RequirePermissions('experience:read')
  list(@Query() query: ListExperienceDto) {
    return this.service.listAdmin(query);
  }

  @Get(':id')
  @RequirePermissions('experience:read')
  findOne(@Param('id') id: string) {
    return this.service.findByIdAdmin(id);
  }

  @Post()
  @RequirePermissions('experience:write')
  create(@Body() dto: CreateExperienceDto, @CurrentUser() actor: AuthenticatedUser) {
    return this.service.create(dto, actor.id);
  }

  @Patch(':id')
  @RequirePermissions('experience:write')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateExperienceDto,
    @CurrentUser() actor: AuthenticatedUser,
  ) {
    return this.service.update(id, dto, actor.id);
  }

  @Delete(':id')
  @RequirePermissions('experience:write')
  remove(@Param('id') id: string, @CurrentUser() actor: AuthenticatedUser) {
    return this.service.remove(id, actor.id);
  }
}
