import { createZodDto } from 'nestjs-zod';
import { TestimonialFieldsSchema } from './testimonial.schema';

export class CreateTestimonialDto extends createZodDto(TestimonialFieldsSchema) {}
