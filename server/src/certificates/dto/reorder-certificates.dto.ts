import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

// Order of `ids` is the new sort order — index 0 becomes sortOrder 0, etc.
export const ReorderCertificatesSchema = z.object({
  ids: z.array(z.string()).min(1),
});

export class ReorderCertificatesDto extends createZodDto(ReorderCertificatesSchema) {}
