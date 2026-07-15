import { Module } from '@nestjs/common';
import { ClientsPublicController } from './clients-public.controller';
import { ClientsAdminController } from './clients-admin.controller';
import { ClientsService } from './clients.service';
import { ClientsRepository } from './clients.repository';

@Module({
  controllers: [ClientsPublicController, ClientsAdminController],
  providers: [ClientsService, ClientsRepository],
})
export class ClientsModule {}
