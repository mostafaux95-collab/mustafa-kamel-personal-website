import { createZodDto } from 'nestjs-zod';
import { ExperienceFieldsSchema } from './experience.schema';

export class CreateExperienceDto extends createZodDto(ExperienceFieldsSchema) {}
