import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SkillsService } from './skills.service';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Skills (public)')
@Public()
@Controller('skills')
export class SkillsPublicController {
  constructor(private readonly service: SkillsService) {}

  @Get()
  list(
    @Query('category') category?: string,
    @Query('page') page = '1',
    @Query('pageSize') pageSize = '50',
  ) {
    return this.service.listPublic({ category, page: Number(page), pageSize: Number(pageSize) });
  }
}
