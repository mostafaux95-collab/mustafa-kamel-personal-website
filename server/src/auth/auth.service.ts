import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'node:crypto';
import { PrismaService } from '../database/prisma.service';
import { RolesService } from '../roles/roles.service';
import { TokenService } from './tokens/token.service';
import { MailService } from '../mail/mail.service';
import type { AppConfig } from '../config/configuration';
import type { User } from '../../generated/prisma/client';

const BCRYPT_ROUNDS = 12;
const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

export interface RequestMeta {
  userAgent?: string;
  ipAddress?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  refreshTokenExpiresAt: Date;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly rolesService: RolesService,
    private readonly tokenService: TokenService,
    private readonly mailService: MailService,
    private readonly config: ConfigService<AppConfig, true>,
  ) {}

  async validateCredentials(email: string, password: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || user.deletedAt || !user.isActive) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const matches = await bcrypt.compare(password, user.passwordHash);
    if (!matches) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return user;
  }

  async login(user: User, meta: RequestMeta): Promise<AuthTokens> {
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const accessToken = this.tokenService.signAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    const issued = this.tokenService.issueRefreshToken(user.id);
    await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: issued.tokenHash,
        expiresAt: issued.expiresAt,
        userAgent: meta.userAgent,
        ipAddress: meta.ipAddress,
      },
    });

    return {
      accessToken,
      refreshToken: issued.token,
      refreshTokenExpiresAt: issued.expiresAt,
    };
  }

  // Rotates the refresh token on every use. If a token that was already
  // revoked (i.e. already rotated away, or explicitly logged out) is
  // presented again, that's a strong signal of token theft — revoke every
  // session for that user rather than trusting it.
  async refresh(rawToken: string, meta: RequestMeta): Promise<AuthTokens> {
    let payload: { sub: string; tokenId: string };
    try {
      payload = this.tokenService.verifyRefreshToken(rawToken);
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const tokenHash = this.tokenService.hashToken(rawToken);
    const stored = await this.prisma.refreshToken.findUnique({ where: { tokenHash } });

    if (!stored || stored.userId !== payload.sub) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (stored.revokedAt) {
      await this.prisma.refreshToken.updateMany({
        where: { userId: stored.userId, revokedAt: null },
        data: { revokedAt: new Date() },
      });
      throw new UnauthorizedException('Refresh token reuse detected — all sessions revoked');
    }

    if (stored.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token expired');
    }

    const user = await this.prisma.user.findUnique({ where: { id: stored.userId } });
    if (!user || user.deletedAt || !user.isActive) {
      throw new UnauthorizedException('Account is no longer active');
    }

    const issued = this.tokenService.issueRefreshToken(user.id);

    await this.prisma.$transaction([
      this.prisma.refreshToken.update({
        where: { id: stored.id },
        data: { revokedAt: new Date(), replacedByTokenHash: issued.tokenHash },
      }),
      this.prisma.refreshToken.create({
        data: {
          userId: user.id,
          tokenHash: issued.tokenHash,
          expiresAt: issued.expiresAt,
          userAgent: meta.userAgent,
          ipAddress: meta.ipAddress,
        },
      }),
    ]);

    const accessToken = this.tokenService.signAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      accessToken,
      refreshToken: issued.token,
      refreshTokenExpiresAt: issued.expiresAt,
    };
  }

  async logout(rawToken: string): Promise<void> {
    const tokenHash = this.tokenService.hashToken(rawToken);
    await this.prisma.refreshToken.updateMany({
      where: { tokenHash, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  // Always resolves without revealing whether the email exists.
  async forgotPassword(email: string): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || user.deletedAt || !user.isActive) {
      return;
    }
    const token = await this.issuePasswordResetToken(user.id);
    const appUrl = this.config.get('appUrl', { infer: true });
    await this.mailService.sendPasswordResetEmail(user.email, `${appUrl}/reset-password?token=${token}`);
  }

  // Shared by forgot-password and the admin-invite flow (an invite is
  // just "set your initial password via this same token mechanism").
  async issuePasswordResetToken(userId: string): Promise<string> {
    const token = randomBytes(32).toString('hex');
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        passwordResetToken: token,
        passwordResetExpiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS),
      },
    });
    return token;
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { passwordResetToken: token } });
    if (!user || !user.passwordResetExpiresAt || user.passwordResetExpiresAt < new Date()) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const passwordHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: user.id },
        data: {
          passwordHash,
          passwordResetToken: null,
          passwordResetExpiresAt: null,
        },
      }),
      // Force re-login everywhere after a password reset.
      this.prisma.refreshToken.updateMany({
        where: { userId: user.id, revokedAt: null },
        data: { revokedAt: new Date() },
      }),
    ]);
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
    currentTokenHash: string,
  ): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException();
    }

    const matches = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!matches) {
      throw new BadRequestException('Current password is incorrect');
    }

    const passwordHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);

    await this.prisma.$transaction([
      this.prisma.user.update({ where: { id: user.id }, data: { passwordHash } }),
      // Revoke every other session, keep the current one valid.
      this.prisma.refreshToken.updateMany({
        where: { userId: user.id, revokedAt: null, tokenHash: { not: currentTokenHash } },
        data: { revokedAt: new Date() },
      }),
    ]);
  }

  async verifyEmail(token: string): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { emailVerifyToken: token } });
    if (!user || !user.emailVerifyExpiresAt || user.emailVerifyExpiresAt < new Date()) {
      throw new BadRequestException('Invalid or expired verification token');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailVerified: true,
        emailVerifyToken: null,
        emailVerifyExpiresAt: null,
      },
    });
  }
}
