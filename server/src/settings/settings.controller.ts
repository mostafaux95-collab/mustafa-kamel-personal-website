import { Body, Controller, Get, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SettingsService } from './settings.service';
import { UpsertSettingDto } from './dto/upsert-setting.dto';
import { Public } from '../common/decorators/public.decorator';
import { RequirePermissions } from '../common/decorators/permissions.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../common/types/auth.types';

@ApiTags('Settings')
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  // Public in Phase 1 since settings are just a key/value skeleton with
  // nothing sensitive in it yet (e.g. maintenance-mode flag) — revisit
  // splitting public/admin subsets once real settings land in a later phase.
  @Public()
  @Get()
  list() {
    return this.settingsService.list();
  }

  @ApiBearerAuth()
  @Patch()
  @RequirePermissions('settings:manage')
  upsert(@Body() dto: UpsertSettingDto, @CurrentUser() actor: AuthenticatedUser) {
    return this.settingsService.upsert(dto.key, dto.value, actor.id);
  }
}
