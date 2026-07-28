import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { cleanupOpenApiDoc, ZodValidationPipe } from 'nestjs-zod';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { mkdirSync } from 'node:fs';
import { AppModule } from './app.module';
import { UPLOAD_DIR } from './media/storage/storage.service';
import type { AppConfig } from './config/configuration';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = app.get(ConfigService<AppConfig, true>);
  const usingR2 = Boolean(config.get('r2', { infer: true }).bucketName);

  app.use(
    helmet({
      // Uploaded images are fetched cross-origin by the Vite dev server
      // (localhost:5173) and the eventual production frontend origin —
      // helmet's default CORP header blocks that unless relaxed.
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );
  app.use(cookieParser(config.get('cookieSecret', { infer: true })));
  app.enableCors({
    origin: config.get('corsOrigin', { infer: true }),
    credentials: true,
  });

  // Local-disk fallback only (dev, or a host with a persistent volume) —
  // when R2 is configured, uploads live there instead and are served
  // directly from R2's public URL, so there's nothing to mount here.
  // Served outside the /api prefix (setGlobalPrefix only applies to
  // controller routes) so a MediaAsset's stored `url` (e.g.
  // "/uploads/xxx.jpg") resolves directly against the API origin.
  if (!usingR2) {
    mkdirSync(UPLOAD_DIR, { recursive: true });
    app.useStaticAssets(UPLOAD_DIR, { prefix: '/uploads' });
  }

  app.useGlobalPipes(new ZodValidationPipe());
  app.setGlobalPrefix('api');

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Portfolio CMS API')
    .setDescription('Phase 1: auth, RBAC, and site-settings foundation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = cleanupOpenApiDoc(SwaggerModule.createDocument(app, swaggerConfig));
  SwaggerModule.setup('api/docs', app, document);

  const port = config.get('port', { infer: true });
  await app.listen(port);
  console.log(`API listening on http://localhost:${port}/api`);
  console.log(`Swagger docs at http://localhost:${port}/api/docs`);
}

bootstrap();
