import { createZodDto } from 'nestjs-zod';
import { SkillFieldsSchema } from './skill.schema';

export class UpdateSkillDto extends createZodDto(SkillFieldsSchema.partial()) {}
