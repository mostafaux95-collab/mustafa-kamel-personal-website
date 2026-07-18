import { createZodDto } from 'nestjs-zod';
import { EducationFieldsSchema } from './education.schema';

export class CreateEducationDto extends createZodDto(EducationFieldsSchema) {}
