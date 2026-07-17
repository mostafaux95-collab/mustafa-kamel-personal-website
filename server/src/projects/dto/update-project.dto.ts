import { createZodDto } from 'nestjs-zod';
import { ProjectFieldsSchema } from './project.schema';
import { toUpdateSchema } from '../../common/zod/to-update-schema';

export class UpdateProjectDto extends createZodDto(toUpdateSchema(ProjectFieldsSchema)) {}
