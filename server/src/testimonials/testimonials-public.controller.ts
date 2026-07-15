import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TestimonialsService } from './testimonials.service';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Testimonials (public)')
@Public()
@Controller('testimonials')
export class TestimonialsPublicController {
  constructor(private readonly service: TestimonialsService) {}

  @Get()
  list(@Query('page') page = '1', @Query('pageSize') pageSize = '20') {
    return this.service.listPublic({ page: Number(page), pageSize: Number(pageSize) });
  }
}
