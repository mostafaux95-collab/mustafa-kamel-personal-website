import { createZodDto } from 'nestjs-zod';
import { UpdateContactMessageSchema } from './contact-message.schema';

export class UpdateContactMessageDto extends createZodDto(UpdateContactMessageSchema) {}
