import { z } from 'zod';
import { ContentStatus } from '../../../generated/prisma/client';

export const EducationFieldsSchema = z.object({
  degree: z.string().min(1),
  degreeAr: z.string().optional(),
  school: z.string().min(1),
  schoolAr: z.string().optional(),
  years: z.string().min(1),
  status: z.nativeEnum(ContentStatus).default(ContentStatus.DRAFT),
  sortOrder: z.coerce.number().int().default(0),
});
