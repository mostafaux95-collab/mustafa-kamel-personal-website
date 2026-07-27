import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CertificateService } from './certificate.service';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Certificates (public)')
@Public()
@Controller('certificates')
export class CertificatePublicController {
  constructor(private readonly service: CertificateService) {}

  @Get()
  list(@Query('page') page = '1', @Query('pageSize') pageSize = '50') {
    return this.service.listPublic({ page: Number(page), pageSize: Number(pageSize) });
  }
}
