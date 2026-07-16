import { Injectable, NotFoundException } from '@nestjs/common';
import { readFile, unlink } from 'node:fs/promises';
import { join } from 'node:path';
import { imageSize } from 'image-size';
import { MediaRepository, type ListFilter } from './media.repository';
import type { UpdateMediaDto } from './dto/update-media.dto';

export const UPLOAD_DIR = join(process.cwd(), 'uploads');

@Injectable()
export class MediaService {
  constructor(private readonly repo: MediaRepository) {}

  async recordUpload(
    file: Express.Multer.File,
    fields: { altText?: string; altTextAr?: string; folder?: string },
    actorId: string,
  ) {
    let width: number | undefined;
    let height: number | undefined;
    try {
      // image-size v2 reads raw bytes, not a file path.
      const buffer = await readFile(file.path);
      const dimensions = imageSize(new Uint8Array(buffer));
      width = dimensions.width;
      height = dimensions.height;
    } catch {
      // Non-image upload (or unsupported format) — width/height stay null.
    }

    return this.repo.create(
      {
        url: `/uploads/${file.filename}`,
        filename: file.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
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
    try {
      await unlink(join(UPLOAD_DIR, item.filename));
    } catch {
      // File already gone — fine, still remove the DB record.
    }
    return this.repo.hardDelete(id);
  }
}
