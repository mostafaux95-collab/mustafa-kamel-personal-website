import { Body, Controller, Delete, Get, Param, Patch, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ContactService } from './contact.service';
import { ListContactMessagesDto } from './dto/list-contact-messages.dto';
import { UpdateContactMessageDto } from './dto/update-contact-message.dto';
import { RequirePermissions } from '../common/decorators/permissions.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../common/types/auth.types';

@ApiTags('Contact (admin)')
@ApiBearerAuth()
@Controller('admin/messages')
export class ContactAdminController {
  constructor(private readonly service: ContactService) {}

  @Get()
  @RequirePermissions('messages:read')
  list(@Query() query: ListContactMessagesDto) {
    return this.service.list(query);
  }

  @Get(':id')
  @RequirePermissions('messages:read')
  findOne(@Param('id') id: string) {
    return this.service.findByIdAdmin(id);
  }

  @Patch(':id')
  @RequirePermissions('messages:write')
  setRead(
    @Param('id') id: string,
    @Body() dto: UpdateContactMessageDto,
    @CurrentUser() actor: AuthenticatedUser,
  ) {
    return this.service.setRead(id, dto, actor.id);
  }

  @Delete(':id')
  @RequirePermissions('messages:write')
  remove(@Param('id') id: string, @CurrentUser() actor: AuthenticatedUser) {
    return this.service.remove(id, actor.id);
  }
}
