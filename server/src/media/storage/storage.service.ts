import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { mkdir, writeFile, unlink } from 'node:fs/promises';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { extname } from 'node:path';
import type { AppConfig } from '../../config/configuration';
import { trimAndPadLogo } from './logo-processing';

export const UPLOAD_DIR = join(process.cwd(), 'uploads');

export interface StoredFile {
  url: string;
  filename: string;
  mimeType: string;
  buffer: Buffer;
}

// Two backends behind one interface: Cloudflare R2 (S3-compatible) when
// configured, local disk otherwise. Local disk is only appropriate for
// dev — most free hosts wipe it on every deploy/restart — so production
// must set the R2_* env vars (see validation.schema.ts).
@Injectable()
export class StorageService {
  private readonly r2Client: S3Client | null;
  private readonly bucketName: string | undefined;
  private readonly publicUrl: string | undefined;

  constructor(private readonly config: ConfigService<AppConfig, true>) {
    const r2 = this.config.get('r2', { infer: true });
    if (r2.accountId && r2.accessKeyId && r2.secretAccessKey && r2.bucketName && r2.publicUrl) {
      this.r2Client = new S3Client({
        region: 'auto',
        endpoint: `https://${r2.accountId}.r2.cloudflarestorage.com`,
        credentials: {
          accessKeyId: r2.accessKeyId,
          secretAccessKey: r2.secretAccessKey,
        },
      });
      this.bucketName = r2.bucketName;
      this.publicUrl = r2.publicUrl.replace(/\/$/, '');
    } else {
      this.r2Client = null;
    }
  }

  get usingR2() {
    return this.r2Client !== null;
  }

  async save(
    buffer: Buffer,
    originalName: string,
    mimeType: string,
    options: { trimLogo?: boolean } = {},
  ): Promise<StoredFile> {
    let outBuffer = buffer;
    let outMimeType = mimeType;
    let outName = originalName;

    if (options.trimLogo && mimeType.startsWith('image/') && mimeType !== 'image/svg+xml') {
      try {
        outBuffer = await trimAndPadLogo(buffer);
        outMimeType = 'image/png';
        outName = `${originalName.replace(/\.[^.]+$/, '')}.png`;
      } catch {
        // Malformed/unsupported image for sharp to process — fall back to
        // storing it unmodified rather than failing the whole upload.
      }
    }

    const filename = `${randomUUID()}${extname(outName)}`;

    if (this.r2Client) {
      await this.r2Client.send(
        new PutObjectCommand({
          Bucket: this.bucketName,
          Key: filename,
          Body: outBuffer,
          ContentType: outMimeType,
        }),
      );
      return { url: `${this.publicUrl}/${filename}`, filename, mimeType: outMimeType, buffer: outBuffer };
    }

    await mkdir(UPLOAD_DIR, { recursive: true });
    await writeFile(join(UPLOAD_DIR, filename), outBuffer);
    return { url: `/uploads/${filename}`, filename, mimeType: outMimeType, buffer: outBuffer };
  }

  async remove(filename: string): Promise<void> {
    if (this.r2Client) {
      await this.r2Client.send(new DeleteObjectCommand({ Bucket: this.bucketName, Key: filename }));
      return;
    }

    try {
      await unlink(join(UPLOAD_DIR, filename));
    } catch {
      // File already gone — fine, caller still removes the DB record.
    }
  }
}
