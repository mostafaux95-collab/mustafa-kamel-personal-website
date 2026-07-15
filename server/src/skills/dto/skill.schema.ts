import { z } from 'zod';
import { ContentStatus } from '../../../generated/prisma/client';

// Matches the existing frontend's SkillCategory union (src/data/skills.ts).
export const SKILL_CATEGORIES = ['Design', 'Research', 'Systems', 'AI', 'Frontend', 'Leadership'] as const;

export const SkillFieldsSchema = z.object({
  name: z.string().min(1),
  category: z.enum(SKILL_CATEGORIES),
  detail: z.string().min(1),
  detailAr: z.string().optional(),
  level: z.coerce.number().int().min(1).max(5).optional(),
  years: z.coerce.number().int().min(0).optional(),
  status: z.nativeEnum(ContentStatus).default(ContentStatus.DRAFT),
  sortOrder: z.coerce.number().int().default(0),
});
