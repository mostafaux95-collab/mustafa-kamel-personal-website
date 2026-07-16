import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { ContactService } from './contact.service';
import { CreateContactMessageDto } from './dto/create-contact-message.dto';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Contact (public)')
@Public()
@Controller('contact')
export class ContactPublicController {
  constructor(private readonly service: ContactService) {}

  @Throttle({ default: { limit: 3, ttl: 60_000 } })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  submit(@Body() dto: CreateContactMessageDto) {
    return this.service.submit(dto);
  }
}
