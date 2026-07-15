import { createZodDto } from 'nestjs-zod';
import { ServiceFieldsSchema } from './service.schema';

export class CreateServiceDto extends createZodDto(ServiceFieldsSchema) {}
