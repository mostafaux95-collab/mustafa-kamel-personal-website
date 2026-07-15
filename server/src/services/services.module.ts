import { Module } from '@nestjs/common';
import { ServicesPublicController } from './services-public.controller';
import { ServicesAdminController } from './services-admin.controller';
import { ServicesService } from './services.service';
import { ServicesRepository } from './services.repository';

@Module({
  controllers: [ServicesPublicController, ServicesAdminController],
  providers: [ServicesService, ServicesRepository],
})
export class ServicesModule {}
