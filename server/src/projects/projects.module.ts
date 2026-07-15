import { Module } from '@nestjs/common';
import { ProjectsPublicController } from './projects-public.controller';
import { ProjectsAdminController } from './projects-admin.controller';
import { ProjectsService } from './projects.service';
import { ProjectsRepository } from './projects.repository';

@Module({
  controllers: [ProjectsPublicController, ProjectsAdminController],
  providers: [ProjectsService, ProjectsRepository],
})
export class ProjectsModule {}
