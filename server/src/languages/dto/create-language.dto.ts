import { createZodDto } from 'nestjs-zod';
import { LanguageFieldsSchema } from './language.schema';

export class CreateLanguageDto extends createZodDto(LanguageFieldsSchema) {}
