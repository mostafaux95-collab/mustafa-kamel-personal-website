import { createZodDto } from 'nestjs-zod';
import { ProjectFieldsSchema } from './project.schema';

export class CreateProjectDto extends createZodDto(ProjectFieldsSchema) {}
