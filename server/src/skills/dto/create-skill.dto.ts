import { createZodDto } from 'nestjs-zod';
import { SkillFieldsSchema } from './skill.schema';

export class CreateSkillDto extends createZodDto(SkillFieldsSchema) {}
