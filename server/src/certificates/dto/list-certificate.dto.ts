import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const ListCertificateSchema = z.object({
  isVisible: z.coerce.boolean().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(200).default(50),
});

export class ListCertificateDto extends createZodDto(ListCertificateSchema) {}
