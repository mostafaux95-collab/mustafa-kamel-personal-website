import { createZodDto } from 'nestjs-zod';
import { SkillFieldsSchema } from './skill.schema';
import { toUpdateSchema } from '../../common/zod/to-update-schema';

export class UpdateSkillDto extends createZodDto(toUpdateSchema(SkillFieldsSchema)) {}
