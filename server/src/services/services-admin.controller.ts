import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ListServicesDto } from './dto/list-services.dto';
import { RequirePermissions } from '../common/decorators/permissions.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../common/types/auth.types';

@ApiTags('Services (admin)')
@ApiBearerAuth()
@Controller('admin/services')
export class ServicesAdminController {
  constructor(private readonly service: ServicesService) {}

  @Get()
  @RequirePermissions('services:read')
  list(@Query() query: ListServicesDto) {
    return this.service.listAdmin(query);
  }

  @Get(':id')
  @RequirePermissions('services:read')
  findOne(@Param('id') id: string) {
    return this.service.findByIdAdmin(id);
  }

  @Post()
  @RequirePermissions('services:write')
  create(@Body() dto: CreateServiceDto, @CurrentUser() actor: AuthenticatedUser) {
    return this.service.create(dto, actor.id);
  }

  @Patch(':id')
  @RequirePermissions('services:write')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateServiceDto,
    @CurrentUser() actor: AuthenticatedUser,
  ) {
    return this.service.update(id, dto, actor.id);
  }

  @Delete(':id')
  @RequirePermissions('services:write')
  remove(@Param('id') id: string, @CurrentUser() actor: AuthenticatedUser) {
    return this.service.remove(id, actor.id);
  }
}
