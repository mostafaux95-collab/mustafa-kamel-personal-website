import { createZodDto } from 'nestjs-zod';
import { ServiceFieldsSchema } from './service.schema';
import { toUpdateSchema } from '../../common/zod/to-update-schema';

export class UpdateServiceDto extends createZodDto(toUpdateSchema(ServiceFieldsSchema)) {}
