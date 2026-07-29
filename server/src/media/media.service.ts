import { Injectable, NotFoundException } from '@nestjs/common';
import { imageSize } from 'image-size';
import { MediaRepository, type ListFilter } from './media.repository';
import { StorageService } from './storage/storage.service';
import type { UpdateMediaDto } from './dto/update-media.dto';

@Injectable()
export class MediaService {
  constructor(
    private readonly repo: MediaRepository,
    private readonly storage: StorageService,
  ) {}

  async recordUpload(
    file: Express.Multer.File,
    fields: { altText?: string; altTextAr?: string; folder?: string; trimLogo?: boolean },
    actorId: string,
  ) {
    const stored = await this.storage.save(file.buffer, file.originalname, file.mimetype, {
      trimLogo: fields.trimLogo,
    });

    let width: number | undefined;
    let height: number | undefined;
    try {
      // Measure the actually-stored bytes — trimming changes dimensions.
      const dimensions = imageSize(new Uint8Array(stored.buffer));
      width = dimensions.width;
      height = dimensions.height;
    } catch {
      // Non-image upload (or unsupported format) — width/height stay null.
    }

    return this.repo.create(
      {
        url: stored.url,
        filename: stored.filename,
        originalName: file.originalname,
        mimeType: stored.mimeType,
        size: file.size,
        width,
        height,
        altText: fields.altText,
        altTextAr: fields.altTextAr,
        folder: fields.folder,
      },
      actorId,
    );
  }

  list(query: ListFilter) {
    return this.repo.list(query);
  }

  async findByIdAdmin(id: string) {
    const item = await this.repo.findUnique({ where: { id } });
    if (!item || item.deletedAt) throw new NotFoundException('Media asset not found');
    return item;
  }

  async update(id: string, dto: UpdateMediaDto, actorId: string) {
    await this.findByIdAdmin(id);
    return this.repo.update({ id }, dto, actorId);
  }

  async remove(id: string) {
    const item = await this.findByIdAdmin(id);
    await this.storage.remove(item.filename);
    return this.repo.hardDelete(id);
  }
}
