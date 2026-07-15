import { z } from 'zod';
import { ContentStatus } from '../../../generated/prisma/client';

export const ServiceFieldsSchema = z.object({
  title: z.string().min(1),
  titleAr: z.string().optional(),
  body: z.string().min(1),
  bodyAr: z.string().optional(),
  icon: z.string().optional(),
  status: z.nativeEnum(ContentStatus).default(ContentStatus.DRAFT),
  sortOrder: z.coerce.number().int().default(0),
});
