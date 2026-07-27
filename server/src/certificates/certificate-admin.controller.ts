import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CertificateService } from './certificate.service';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { UpdateCertificateDto } from './dto/update-certificate.dto';
import { ListCertificateDto } from './dto/list-certificate.dto';
import { ReorderCertificatesDto } from './dto/reorder-certificates.dto';
import { RequirePermissions } from '../common/decorators/permissions.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../common/types/auth.types';

@ApiTags('Certificates (admin)')
@ApiBearerAuth()
@Controller('admin/certificates')
export class CertificateAdminController {
  constructor(private readonly service: CertificateService) {}

  @Get()
  @RequirePermissions('certificates:read')
  list(@Query() query: ListCertificateDto) {
    return this.service.listAdmin(query);
  }

  @Get(':id')
  @RequirePermissions('certificates:read')
  findOne(@Param('id') id: string) {
    return this.service.findByIdAdmin(id);
  }

  @Post()
  @RequirePermissions('certificates:write')
  create(@Body() dto: CreateCertificateDto, @CurrentUser() actor: AuthenticatedUser) {
    return this.service.create(dto, actor.id);
  }

  // Registered before ':id' so Nest doesn't try to match "reorder" as an id.
  @Patch('reorder')
  @RequirePermissions('certificates:write')
  reorder(@Body() dto: ReorderCertificatesDto, @CurrentUser() actor: AuthenticatedUser) {
    return this.service.reorder(dto.ids, actor.id);
  }

  @Patch(':id')
  @RequirePermissions('certificates:write')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateCertificateDto,
    @CurrentUser() actor: AuthenticatedUser,
  ) {
    return this.service.update(id, dto, actor.id);
  }

  @Delete(':id')
  @RequirePermissions('certificates:write')
  remove(@Param('id') id: string, @CurrentUser() actor: AuthenticatedUser) {
    return this.service.remove(id, actor.id);
  }
}
