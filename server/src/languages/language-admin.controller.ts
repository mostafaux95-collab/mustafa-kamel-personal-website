import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LanguageService } from './language.service';
import { CreateLanguageDto } from './dto/create-language.dto';
import { UpdateLanguageDto } from './dto/update-language.dto';
import { ListLanguageDto } from './dto/list-language.dto';
import { RequirePermissions } from '../common/decorators/permissions.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../common/types/auth.types';

@ApiTags('Languages (admin)')
@ApiBearerAuth()
@Controller('admin/languages')
export class LanguageAdminController {
  constructor(private readonly service: LanguageService) {}

  @Get()
  @RequirePermissions('languages:read')
  list(@Query() query: ListLanguageDto) {
    return this.service.listAdmin(query);
  }

  @Get(':id')
  @RequirePermissions('languages:read')
  findOne(@Param('id') id: string) {
    return this.service.findByIdAdmin(id);
  }

  @Post()
  @RequirePermissions('languages:write')
  create(@Body() dto: CreateLanguageDto, @CurrentUser() actor: AuthenticatedUser) {
    return this.service.create(dto, actor.id);
  }

  @Patch(':id')
  @RequirePermissions('languages:write')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateLanguageDto,
    @CurrentUser() actor: AuthenticatedUser,
  ) {
    return this.service.update(id, dto, actor.id);
  }

  @Delete(':id')
  @RequirePermissions('languages:write')
  remove(@Param('id') id: string, @CurrentUser() actor: AuthenticatedUser) {
    return this.service.remove(id, actor.id);
  }
}
