import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { strongPassword } from './password.schema';

export const ResetPasswordSchema = z.object({
  token: z.string().min(1),
  password: strongPassword,
});

export class ResetPasswordDto extends createZodDto(ResetPasswordSchema) {}
