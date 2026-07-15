import { createZodDto } from 'nestjs-zod';
import { ClientFieldsSchema } from './client.schema';

export class CreateClientDto extends createZodDto(ClientFieldsSchema) {}
