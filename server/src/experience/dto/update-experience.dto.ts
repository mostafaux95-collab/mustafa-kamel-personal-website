import { createZodDto } from 'nestjs-zod';
import { ExperienceFieldsSchema } from './experience.schema';

export class UpdateExperienceDto extends createZodDto(ExperienceFieldsSchema.partial()) {}
