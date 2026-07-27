import { createZodDto } from 'nestjs-zod';
import { CertificateFieldsSchema } from './certificate.schema';
import { toUpdateSchema } from '../../common/zod/to-update-schema';

export class UpdateCertificateDto extends createZodDto(toUpdateSchema(CertificateFieldsSchema)) {}
