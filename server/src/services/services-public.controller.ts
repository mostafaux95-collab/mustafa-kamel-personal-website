import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ServicesService } from './services.service';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Services (public)')
@Public()
@Controller('services')
export class ServicesPublicController {
  constructor(private readonly service: ServicesService) {}

  @Get()
  list(@Query('page') page = '1', @Query('pageSize') pageSize = '20') {
    return this.service.listPublic({ page: Number(page), pageSize: Number(pageSize) });
  }
}
