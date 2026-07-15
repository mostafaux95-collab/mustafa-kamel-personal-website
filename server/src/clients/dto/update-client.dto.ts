import { createZodDto } from 'nestjs-zod';
import { ClientFieldsSchema } from './client.schema';

export class UpdateClientDto extends createZodDto(ClientFieldsSchema.partial()) {}
