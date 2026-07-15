import { z } from 'zod';
import { ContentStatus } from '../../../generated/prisma/client';

export const TestimonialFieldsSchema = z.object({
  quote: z.string().min(1),
  quoteAr: z.string().optional(),
  role: z.string().min(1),
  roleAr: z.string().optional(),
  company: z.string().min(1),
  avatarInitial: z.string().optional(),
  avatarBg: z.string().optional(),
  avatarFg: z.string().optional(),
  status: z.nativeEnum(ContentStatus).default(ContentStatus.DRAFT),
  featured: z.boolean().default(false),
  sortOrder: z.coerce.number().int().default(0),
});
