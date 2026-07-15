import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { ContentStatus } from '../../../generated/prisma/client';
import { SKILL_CATEGORIES } from './skill.schema';

export const ListSkillsSchema = z.object({
  status: z.nativeEnum(ContentStatus).optional(),
  category: z.enum(SKILL_CATEGORIES).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export class ListSkillsDto extends createZodDto(ListSkillsSchema) {}
