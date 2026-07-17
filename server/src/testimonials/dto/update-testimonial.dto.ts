import { createZodDto } from 'nestjs-zod';
import { TestimonialFieldsSchema } from './testimonial.schema';
import { toUpdateSchema } from '../../common/zod/to-update-schema';

export class UpdateTestimonialDto extends createZodDto(toUpdateSchema(TestimonialFieldsSchema)) {}
