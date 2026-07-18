import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LanguageService } from './language.service';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Languages (public)')
@Public()
@Controller('languages')
export class LanguagePublicController {
  constructor(private readonly service: LanguageService) {}

  @Get()
  list(@Query('page') page = '1', @Query('pageSize') pageSize = '20') {
    return this.service.listPublic({ page: Number(page), pageSize: Number(pageSize) });
  }
}
