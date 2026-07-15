import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TestimonialsService } from './testimonials.service';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';
import { ListTestimonialsDto } from './dto/list-testimonials.dto';
import { RequirePermissions } from '../common/decorators/permissions.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../common/types/auth.types';

@ApiTags('Testimonials (admin)')
@ApiBearerAuth()
@Controller('admin/testimonials')
export class TestimonialsAdminController {
  constructor(private readonly service: TestimonialsService) {}

  @Get()
  @RequirePermissions('testimonials:read')
  list(@Query() query: ListTestimonialsDto) {
    return this.service.listAdmin(query);
  }

  @Get(':id')
  @RequirePermissions('testimonials:read')
  findOne(@Param('id') id: string) {
    return this.service.findByIdAdmin(id);
  }

  @Post()
  @RequirePermissions('testimonials:write')
  create(@Body() dto: CreateTestimonialDto, @CurrentUser() actor: AuthenticatedUser) {
    return this.service.create(dto, actor.id);
  }

  @Patch(':id')
  @RequirePermissions('testimonials:write')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateTestimonialDto,
    @CurrentUser() actor: AuthenticatedUser,
  ) {
    return this.service.update(id, dto, actor.id);
  }

  @Delete(':id')
  @RequirePermissions('testimonials:write')
  remove(@Param('id') id: string, @CurrentUser() actor: AuthenticatedUser) {
    return this.service.remove(id, actor.id);
  }
}
