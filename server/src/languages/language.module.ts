import { Module } from '@nestjs/common';
import { LanguagePublicController } from './language-public.controller';
import { LanguageAdminController } from './language-admin.controller';
import { LanguageService } from './language.service';
import { LanguageRepository } from './language.repository';

@Module({
  controllers: [LanguagePublicController, LanguageAdminController],
  providers: [LanguageService, LanguageRepository],
})
export class LanguageModule {}
