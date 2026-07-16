import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const UpdateMediaSchema = z.object({
  altText: z.string().optional(),
  altTextAr: z.string().optional(),
  folder: z.string().optional(),
});

export class UpdateMediaDto extends createZodDto(UpdateMediaSchema) {}
