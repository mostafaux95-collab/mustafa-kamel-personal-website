import { z } from 'zod';
import { ContentStatus } from '../../../generated/prisma/client';

export const LanguageFieldsSchema = z.object({
  name: z.string().min(1),
  nameAr: z.string().optional(),
  level: z.string().min(1),
  levelAr: z.string().optional(),
  status: z.nativeEnum(ContentStatus).default(ContentStatus.DRAFT),
  sortOrder: z.coerce.number().int().default(0),
});
