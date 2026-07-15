import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { createHash, randomUUID } from 'node:crypto';
import type { AppConfig } from '../../config/configuration';
import type {
  AccessTokenPayload,
  RefreshTokenPayload,
} from '../../common/types/auth.types';

export interface IssuedRefreshToken {
  token: string;
  tokenId: string;
  tokenHash: string;
  expiresAt: Date;
}

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService<AppConfig, true>,
  ) {}

  signAccessToken(payload: AccessTokenPayload): string {
    return this.jwtService.sign(payload, {
      secret: this.config.get('jwt.accessSecret', { infer: true }),
      expiresIn: this.config.get('jwt.accessTtl', { infer: true }),
    });
  }

  // Refresh tokens are opaque JWTs carrying only `sub`/`tokenId` — the
  // actual session state (revoked/expired/rotated) lives in the
  // RefreshToken table, keyed by the hash of this token.
  issueRefreshToken(userId: string): IssuedRefreshToken {
    const tokenId = randomUUID();
    const payload: RefreshTokenPayload = { sub: userId, tokenId };
    const ttlDays = this.config.get('jwt.refreshTtlDays', { infer: true });

    const token = this.jwtService.sign(payload, {
      secret: this.config.get('jwt.refreshSecret', { infer: true }),
      expiresIn: `${ttlDays}d`,
    });

    return {
      token,
      tokenId,
      tokenHash: this.hashToken(token),
      expiresAt: new Date(Date.now() + ttlDays * 24 * 60 * 60 * 1000),
    };
  }

  verifyRefreshToken(token: string): RefreshTokenPayload {
    return this.jwtService.verify<RefreshTokenPayload>(token, {
      secret: this.config.get('jwt.refreshSecret', { infer: true }),
    });
  }

  // Never store raw refresh tokens — only their hash, so a DB read alone
  // can't be replayed as a live session token.
  hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }
}
