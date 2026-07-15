import { z } from 'zod';
import { ContentStatus } from '../../../generated/prisma/client';

export const ExperienceFieldsSchema = z.object({
  company: z.string().min(1),
  role: z.string().min(1),
  roleAr: z.string().optional(),
  period: z.string().min(1),
  location: z.string().min(1),
  locationAr: z.string().optional(),
  summary: z.string().min(1),
  summaryAr: z.string().optional(),
  highlights: z.array(z.string()).default([]),
  highlightsAr: z.array(z.string()).default([]),
  logoInitial: z.string().optional(),
  logoBg: z.string().optional(),
  logoFg: z.string().optional(),
  status: z.nativeEnum(ContentStatus).default(ContentStatus.DRAFT),
  sortOrder: z.coerce.number().int().default(0),
});
