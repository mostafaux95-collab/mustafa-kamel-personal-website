import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserInviteDto } from './dto/create-user-invite.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RequirePermissions } from '../common/decorators/permissions.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../common/types/auth.types';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  me(@CurrentUser() user: AuthenticatedUser) {
    return this.usersService.findById(user.id);
  }

  @Post('invite')
  @RequirePermissions('users:invite')
  invite(@Body() dto: CreateUserInviteDto, @CurrentUser() actor: AuthenticatedUser) {
    return this.usersService.invite(dto, actor.id);
  }

  @Get()
  @RequirePermissions('users:read')
  list() {
    return this.usersService.list();
  }

  @Get(':id')
  @RequirePermissions('users:read')
  findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Patch(':id')
  @RequirePermissions('users:write')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @CurrentUser() actor: AuthenticatedUser,
  ) {
    return this.usersService.update(id, dto, actor.id);
  }

  @Patch(':id/deactivate')
  @RequirePermissions('users:write')
  deactivate(@Param('id') id: string, @CurrentUser() actor: AuthenticatedUser) {
    return this.usersService.deactivate(id, actor.id);
  }
}
