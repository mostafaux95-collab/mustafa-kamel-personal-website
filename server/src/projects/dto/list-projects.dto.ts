import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { ContentStatus } from '../../../generated/prisma/client';

export const ListProjectsSchema = z.object({
  status: z.nativeEnum(ContentStatus).optional(),
  featured: z.coerce.boolean().optional(),
  category: z.string().optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export class ListProjectsDto extends createZodDto(ListProjectsSchema) {}
