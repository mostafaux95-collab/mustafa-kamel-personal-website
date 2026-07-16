import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const ListMediaSchema = z.object({
  folder: z.string().optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(40),
});

export class ListMediaDto extends createZodDto(ListMediaSchema) {}
