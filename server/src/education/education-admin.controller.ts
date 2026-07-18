import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { EducationService } from './education.service';
import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';
import { ListEducationDto } from './dto/list-education.dto';
import { RequirePermissions } from '../common/decorators/permissions.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../common/types/auth.types';

@ApiTags('Education (admin)')
@ApiBearerAuth()
@Controller('admin/education')
export class EducationAdminController {
  constructor(private readonly service: EducationService) {}

  @Get()
  @RequirePermissions('education:read')
  list(@Query() query: ListEducationDto) {
    return this.service.listAdmin(query);
  }

  @Get(':id')
  @RequirePermissions('education:read')
  findOne(@Param('id') id: string) {
    return this.service.findByIdAdmin(id);
  }

  @Post()
  @RequirePermissions('education:write')
  create(@Body() dto: CreateEducationDto, @CurrentUser() actor: AuthenticatedUser) {
    return this.service.create(dto, actor.id);
  }

  @Patch(':id')
  @RequirePermissions('education:write')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateEducationDto,
    @CurrentUser() actor: AuthenticatedUser,
  ) {
    return this.service.update(id, dto, actor.id);
  }

  @Delete(':id')
  @RequirePermissions('education:write')
  remove(@Param('id') id: string, @CurrentUser() actor: AuthenticatedUser) {
    return this.service.remove(id, actor.id);
  }
}
