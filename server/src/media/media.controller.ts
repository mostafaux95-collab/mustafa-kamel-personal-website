import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { memoryStorage } from 'multer';
import { MediaService } from './media.service';
import { UpdateMediaDto } from './dto/update-media.dto';
import { ListMediaDto } from './dto/list-media.dto';
import { RequirePermissions } from '../common/decorators/permissions.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../common/types/auth.types';

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'application/pdf',
]);
const MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024; // 8MB

@ApiTags('Media (admin)')
@ApiBearerAuth()
@Controller('admin/media')
export class MediaController {
  constructor(private readonly service: MediaService) {}

  @Get()
  @RequirePermissions('media:read')
  list(@Query() query: ListMediaDto) {
    return this.service.list(query);
  }

  @Post('upload')
  @RequirePermissions('media:write')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: MAX_FILE_SIZE_BYTES },
      fileFilter: (_req, file, cb) => {
        // NestJS's own MulterOptions type (not raw multer's) requires
        // both callback arguments always, and only accepts a plain Error
        // for the rejection path — the resulting rejected upload still
        // surfaces as a 400 via Nest's exception handling further up.
        if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
          cb(new Error(`Unsupported file type: ${file.mimetype}`), false);
          return;
        }
        cb(null, true);
      },
    }),
  )
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { altText?: string; altTextAr?: string; folder?: string; trim?: string },
    @CurrentUser() actor: AuthenticatedUser,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    return this.service.recordUpload(file, { ...body, trimLogo: body.trim === 'true' }, actor.id);
  }

  @Patch(':id')
  @RequirePermissions('media:write')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateMediaDto,
    @CurrentUser() actor: AuthenticatedUser,
  ) {
    return this.service.update(id, dto, actor.id);
  }

  @Delete(':id')
  @RequirePermissions('media:write')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
