import { Module } from '@nestjs/common';
import { CertificatePublicController } from './certificate-public.controller';
import { CertificateAdminController } from './certificate-admin.controller';
import { CertificateService } from './certificate.service';
import { CertificateRepository } from './certificate.repository';

@Module({
  controllers: [CertificatePublicController, CertificateAdminController],
  providers: [CertificateService, CertificateRepository],
})
export class CertificateModule {}
