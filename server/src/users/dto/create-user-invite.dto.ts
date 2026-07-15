import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { Role } from '../../../generated/prisma/client';

export const CreateUserInviteSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  role: z.nativeEnum(Role).default(Role.VIEWER),
});

export class CreateUserInviteDto extends createZodDto(CreateUserInviteSchema) {}
