import { z } from 'zod';
import { ContentStatus } from '../../../generated/prisma/client';

export const ClientFieldsSchema = z.object({
  name: z.string().min(1),
  nameAr: z.string().optional(),
  logoInitial: z.string().min(1),
  logoBg: z.string().min(1),
  logoFg: z.string().min(1),
  website: z.string().optional(),
  category: z.string().optional(),
  status: z.nativeEnum(ContentStatus).default(ContentStatus.DRAFT),
  featured: z.boolean().default(false),
  sortOrder: z.coerce.number().int().default(0),
});
