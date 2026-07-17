import { createZodDto } from 'nestjs-zod';
import { ClientFieldsSchema } from './client.schema';
import { toUpdateSchema } from '../../common/zod/to-update-schema';

export class UpdateClientDto extends createZodDto(toUpdateSchema(ClientFieldsSchema)) {}
