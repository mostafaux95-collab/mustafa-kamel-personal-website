import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../../generated/prisma/client';

@ApiTags('Roles')
@ApiBearerAuth()
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get('permissions')
  @Roles(Role.SUPER_ADMIN)
  listPermissions() {
    return this.rolesService.listPermissions();
  }

  @Get('role-permissions')
  @Roles(Role.SUPER_ADMIN)
  listRolePermissions() {
    return this.rolesService.listRolePermissions();
  }
}
