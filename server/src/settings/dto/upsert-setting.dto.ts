import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const UpsertSettingSchema = z.object({
  key: z.string().min(1),
  value: z.unknown(),
});

export class UpsertSettingDto extends createZodDto(UpsertSettingSchema) {}
