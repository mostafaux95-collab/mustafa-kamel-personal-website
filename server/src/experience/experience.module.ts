import { Module } from '@nestjs/common';
import { ExperiencePublicController } from './experience-public.controller';
import { ExperienceAdminController } from './experience-admin.controller';
import { ExperienceService } from './experience.service';
import { ExperienceRepository } from './experience.repository';

@Module({
  controllers: [ExperiencePublicController, ExperienceAdminController],
  providers: [ExperienceService, ExperienceRepository],
})
export class ExperienceModule {}
