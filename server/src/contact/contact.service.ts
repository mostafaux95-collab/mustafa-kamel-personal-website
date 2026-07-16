import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ContactRepository, type ListContactMessagesFilter } from './contact.repository';
import { MailService } from '../mail/mail.service';
import type { AppConfig } from '../config/configuration';
import type { CreateContactMessageDto } from './dto/create-contact-message.dto';
import type { UpdateContactMessageDto } from './dto/update-contact-message.dto';

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);

  constructor(
    private readonly repo: ContactRepository,
    private readonly mail: MailService,
    private readonly config: ConfigService<AppConfig, true>,
  ) {}

  async submit(dto: CreateContactMessageDto) {
    const message = await this.repo.create(dto);
    const notifyTo = this.config.get('superAdmin.email', { infer: true });
    try {
      await this.mail.sendContactNotification(notifyTo, dto);
    } catch (err) {
      // The submission itself already succeeded and is safely stored —
      // a notification-delivery failure shouldn't turn into a 500 for
      // the visitor who just submitted the form.
      this.logger.error('Failed to send contact notification email', err);
    }
    return message;
  }

  list(query: ListContactMessagesFilter) {
    return this.repo.list(query);
  }

  async findByIdAdmin(id: string) {
    const item = await this.repo.findUnique({ where: { id } });
    if (!item || item.deletedAt) throw new NotFoundException('Message not found');
    return item;
  }

  async setRead(id: string, dto: UpdateContactMessageDto, actorId: string) {
    await this.findByIdAdmin(id);
    return this.repo.update({ id }, dto, actorId);
  }

  async remove(id: string, actorId: string) {
    await this.findByIdAdmin(id);
    return this.repo.softDelete({ id }, actorId);
  }
}
