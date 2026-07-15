import { createZodDto } from 'nestjs-zod';
import { ServiceFieldsSchema } from './service.schema';

export class UpdateServiceDto extends createZodDto(ServiceFieldsSchema.partial()) {}
