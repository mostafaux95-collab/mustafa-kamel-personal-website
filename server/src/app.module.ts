import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import configuration from './config/configuration';
import { validateEnv } from './config/validation.schema';
import { PrismaModule } from './database/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { MailModule } from './mail/mail.module';
import { SettingsModule } from './settings/settings.module';
import { HealthModule } from './health/health.module';
import { ProjectsModule } from './projects/projects.module';
import { TestimonialsModule } from './testimonials/testimonials.module';
import { ClientsModule } from './clients/clients.module';
import { ServicesModule } from './services/services.module';
import { SkillsModule } from './skills/skills.module';
import { ExperienceModule } from './experience/experience.module';
import { EducationModule } from './education/education.module';
import { LanguageModule } from './languages/language.module';
import { CertificateModule } from './certificates/certificate.module';
import { MediaModule } from './media/media.module';
import { ContactModule } from './contact/contact.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { PermissionsGuard } from './common/guards/permissions.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validate: validateEnv,
    }),
    ThrottlerModule.forRoot({
      // In-memory storage is fine for a single-instance Phase 1 deployment;
      // move to a Redis-backed ThrottlerStorage once the API scales
      // horizontally (Redis is already provisioned for that day).
      throttlers: [{ ttl: 60_000, limit: 100 }],
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    RolesModule,
    MailModule,
    SettingsModule,
    HealthModule,
    ProjectsModule,
    TestimonialsModule,
    ClientsModule,
    ServicesModule,
    SkillsModule,
    ExperienceModule,
    EducationModule,
    LanguageModule,
    CertificateModule,
    MediaModule,
    ContactModule,
  ],
  providers: [
    // Applied in array order: rate-limit first (cheapest check), then
    // authenticate, then authorize by role, then by fine-grained permission.
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_GUARD, useClass: PermissionsGuard },
    { provide: APP_FILTER, useClass: PrismaExceptionFilter },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
  ],
})
export class AppModule {}
