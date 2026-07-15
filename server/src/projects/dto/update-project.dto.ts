import { createZodDto } from 'nestjs-zod';
import { ProjectFieldsSchema } from './project.schema';

export class UpdateProjectDto extends createZodDto(ProjectFieldsSchema.partial()) {}
