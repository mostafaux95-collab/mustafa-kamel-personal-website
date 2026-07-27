import { createZodDto } from 'nestjs-zod';
import { CertificateFieldsSchema } from './certificate.schema';

export class CreateCertificateDto extends createZodDto(CertificateFieldsSchema) {}
