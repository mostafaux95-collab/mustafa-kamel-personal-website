import { z } from 'zod';
import { ContentStatus } from '../../../generated/prisma/client';

export const ClientFieldsSchema = z.object({
  name: z.string().min(1),
  nameAr: z.string().optional(),
  logoInitial: z.string().optional(),
  logoBg: z.string().optional(),
  logoFg: z.string().optional(),
  logoUrl: z.string().optional(),
  website: z.string().optional(),
  category: z.string().optional(),
  status: z.nativeEnum(ContentStatus).default(ContentStatus.DRAFT),
  featured: z.boolean().default(false),
  sortOrder: z.coerce.number().int().default(0),
});
