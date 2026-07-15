import { createZodDto } from 'nestjs-zod';
import { TestimonialFieldsSchema } from './testimonial.schema';

export class UpdateTestimonialDto extends createZodDto(TestimonialFieldsSchema.partial()) {}
