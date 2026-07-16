import { Module } from '@nestjs/common';
import { ContactPublicController } from './contact-public.controller';
import { ContactAdminController } from './contact-admin.controller';
import { ContactService } from './contact.service';
import { ContactRepository } from './contact.repository';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [MailModule],
  controllers: [ContactPublicController, ContactAdminController],
  providers: [ContactService, ContactRepository],
})
export class ContactModule {}
