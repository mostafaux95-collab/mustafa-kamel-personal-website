import { Module } from '@nestjs/common';
import { TestimonialsPublicController } from './testimonials-public.controller';
import { TestimonialsAdminController } from './testimonials-admin.controller';
import { TestimonialsService } from './testimonials.service';
import { TestimonialsRepository } from './testimonials.repository';

@Module({
  controllers: [TestimonialsPublicController, TestimonialsAdminController],
  providers: [TestimonialsService, TestimonialsRepository],
})
export class TestimonialsModule {}
