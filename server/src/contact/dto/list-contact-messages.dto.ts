import { createZodDto } from 'nestjs-zod';
import { ListContactMessagesSchema } from './contact-message.schema';

export class ListContactMessagesDto extends createZodDto(ListContactMessagesSchema) {}
