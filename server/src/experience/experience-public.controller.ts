import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExperienceService } from './experience.service';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Experience (public)')
@Public()
@Controller('experience')
export class ExperiencePublicController {
  constructor(private readonly service: ExperienceService) {}

  @Get()
  list(@Query('page') page = '1', @Query('pageSize') pageSize = '20') {
    return this.service.listPublic({ page: Number(page), pageSize: Number(pageSize) });
  }
}
