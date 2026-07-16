import { createZodDto } from 'nestjs-zod';
import { CreateContactMessageSchema } from './contact-message.schema';

export class CreateContactMessageDto extends createZodDto(CreateContactMessageSchema) {}
