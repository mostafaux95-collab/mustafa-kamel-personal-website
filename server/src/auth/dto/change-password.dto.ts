import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { strongPassword } from './password.schema';

export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: strongPassword,
});

export class ChangePasswordDto extends createZodDto(ChangePasswordSchema) {}
