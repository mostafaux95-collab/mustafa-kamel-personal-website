import { Module } from '@nestjs/common';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { MediaRepository } from './media.repository';
import { StorageService } from './storage/storage.service';

@Module({
  controllers: [MediaController],
  providers: [MediaService, MediaRepository, StorageService],
})
export class MediaModule {}
