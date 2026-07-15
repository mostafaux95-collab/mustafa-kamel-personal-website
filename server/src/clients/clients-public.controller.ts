import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ClientsService } from './clients.service';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Clients (public)')
@Public()
@Controller('clients')
export class ClientsPublicController {
  constructor(private readonly service: ClientsService) {}

  @Get()
  list(@Query('page') page = '1', @Query('pageSize') pageSize = '20') {
    return this.service.listPublic({ page: Number(page), pageSize: Number(pageSize) });
  }
}
