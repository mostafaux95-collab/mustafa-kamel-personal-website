import { Module } from '@nestjs/common';
import { SkillsPublicController } from './skills-public.controller';
import { SkillsAdminController } from './skills-admin.controller';
import { SkillsService } from './skills.service';
import { SkillsRepository } from './skills.repository';

@Module({
  controllers: [SkillsPublicController, SkillsAdminController],
  providers: [SkillsService, SkillsRepository],
})
export class SkillsModule {}
