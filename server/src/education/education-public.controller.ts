import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EducationService } from './education.service';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Education (public)')
@Public()
@Controller('education')
export class EducationPublicController {
  constructor(private readonly service: EducationService) {}

  @Get()
  list(@Query('page') page = '1', @Query('pageSize') pageSize = '20') {
    return this.service.listPublic({ page: Number(page), pageSize: Number(pageSize) });
  }
}
