import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { ContentStatus } from '../../../generated/prisma/client';

export const ListExperienceSchema = z.object({
  status: z.nativeEnum(ContentStatus).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export class ListExperienceDto extends createZodDto(ListExperienceSchema) {}
