import { Module } from '@nestjs/common';
import { EducationPublicController } from './education-public.controller';
import { EducationAdminController } from './education-admin.controller';
import { EducationService } from './education.service';
import { EducationRepository } from './education.repository';

@Module({
  controllers: [EducationPublicController, EducationAdminController],
  providers: [EducationService, EducationRepository],
})
export class EducationModule {}
