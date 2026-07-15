import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SkillsService } from './skills.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { ListSkillsDto } from './dto/list-skills.dto';
import { RequirePermissions } from '../common/decorators/permissions.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../common/types/auth.types';

@ApiTags('Skills (admin)')
@ApiBearerAuth()
@Controller('admin/skills')
export class SkillsAdminController {
  constructor(private readonly service: SkillsService) {}

  @Get()
  @RequirePermissions('skills:read')
  list(@Query() query: ListSkillsDto) {
    return this.service.listAdmin(query);
  }

  @Get(':id')
  @RequirePermissions('skills:read')
  findOne(@Param('id') id: string) {
    return this.service.findByIdAdmin(id);
  }

  @Post()
  @RequirePermissions('skills:write')
  create(@Body() dto: CreateSkillDto, @CurrentUser() actor: AuthenticatedUser) {
    return this.service.create(dto, actor.id);
  }

  @Patch(':id')
  @RequirePermissions('skills:write')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateSkillDto,
    @CurrentUser() actor: AuthenticatedUser,
  ) {
    return this.service.update(id, dto, actor.id);
  }

  @Delete(':id')
  @RequirePermissions('skills:write')
  remove(@Param('id') id: string, @CurrentUser() actor: AuthenticatedUser) {
    return this.service.remove(id, actor.id);
  }
}
