import { createZodDto } from 'nestjs-zod';
import { EducationFieldsSchema } from './education.schema';
import { toUpdateSchema } from '../../common/zod/to-update-schema';

export class UpdateEducationDto extends createZodDto(toUpdateSchema(EducationFieldsSchema)) {}
