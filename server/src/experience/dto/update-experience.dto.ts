import { createZodDto } from 'nestjs-zod';
import { ExperienceFieldsSchema } from './experience.schema';
import { toUpdateSchema } from '../../common/zod/to-update-schema';

export class UpdateExperienceDto extends createZodDto(toUpdateSchema(ExperienceFieldsSchema)) {}
