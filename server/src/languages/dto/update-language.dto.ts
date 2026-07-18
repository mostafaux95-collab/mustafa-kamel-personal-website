import { createZodDto } from 'nestjs-zod';
import { LanguageFieldsSchema } from './language.schema';
import { toUpdateSchema } from '../../common/zod/to-update-schema';

export class UpdateLanguageDto extends createZodDto(toUpdateSchema(LanguageFieldsSchema)) {}
