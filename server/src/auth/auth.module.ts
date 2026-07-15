import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TokenService } from './tokens/token.service';
import { JwtAccessStrategy } from './strategies/jwt-access.strategy';
import { RolesModule } from '../roles/roles.module';
import { MailModule } from '../mail/mail.module';

// Global guards (JwtAuthGuard/RolesGuard/PermissionsGuard) are registered
// centrally in AppModule instead of here, so their relative order is
// explicit and doesn't depend on cross-module APP_GUARD resolution order.
@Module({
  imports: [PassportModule, JwtModule.register({}), RolesModule, MailModule],
  controllers: [AuthController],
  providers: [AuthService, TokenService, JwtAccessStrategy],
  exports: [AuthService, TokenService],
})
export class AuthModule {}
