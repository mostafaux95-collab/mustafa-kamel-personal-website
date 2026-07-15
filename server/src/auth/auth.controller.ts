import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { CookieOptions, Request, Response } from 'express';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { TokenService } from './tokens/token.service';
import { Public } from '../common/decorators/public.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import type { AppConfig } from '../config/configuration';
import type { AuthenticatedUser } from '../common/types/auth.types';

const REFRESH_COOKIE_NAME = 'refresh_token';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
    private readonly config: ConfigService<AppConfig, true>,
  ) {}

  private cookieOptions(expiresAt: Date): CookieOptions {
    return {
      httpOnly: true,
      secure: this.config.get('nodeEnv', { infer: true }) === 'production',
      sameSite: 'lax',
      // Must match the route prefix as seen by the browser, i.e. including
      // the global 'api' prefix set in main.ts — otherwise the cookie is
      // scoped to a path that never matches actual requests.
      path: '/api/auth',
      expires: expiresAt,
    };
  }

  private meta(req: Request) {
    return {
      userAgent: req.headers['user-agent'],
      ipAddress: req.ip,
    };
  }

  @Public()
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.validateCredentials(dto.email, dto.password);
    const tokens = await this.authService.login(user, this.meta(req));

    res.cookie(REFRESH_COOKIE_NAME, tokens.refreshToken, this.cookieOptions(tokens.refreshTokenExpiresAt));

    return {
      accessToken: tokens.accessToken,
      user: { id: user.id, email: user.email, role: user.role, firstName: user.firstName, lastName: user.lastName },
    };
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const rawToken = req.cookies?.[REFRESH_COOKIE_NAME];
    if (!rawToken) {
      throw new UnauthorizedException('No refresh token provided');
    }

    const tokens = await this.authService.refresh(rawToken, this.meta(req));
    res.cookie(REFRESH_COOKIE_NAME, tokens.refreshToken, this.cookieOptions(tokens.refreshTokenExpiresAt));

    return { accessToken: tokens.accessToken };
  }

  @ApiBearerAuth()
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const rawToken = req.cookies?.[REFRESH_COOKIE_NAME];
    if (rawToken) {
      await this.authService.logout(rawToken);
    }
    res.clearCookie(REFRESH_COOKIE_NAME, { path: '/api/auth' });
  }

  @Public()
  @Throttle({ default: { limit: 3, ttl: 60_000 } })
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    await this.authService.forgotPassword(dto.email);
    // Deliberately generic response — never confirm whether the email exists.
    return { message: 'If that email exists, a reset link has been sent.' };
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() dto: ResetPasswordDto) {
    await this.authService.resetPassword(dto.token, dto.password);
    return { message: 'Password has been reset. Please log in again.' };
  }

  @Public()
  @Get('verify-email')
  async verifyEmail(@Query('token') token: string) {
    await this.authService.verifyEmail(token);
    return { message: 'Email verified.' };
  }

  @ApiBearerAuth()
  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: ChangePasswordDto,
    @Req() req: Request,
  ) {
    const rawToken = req.cookies?.[REFRESH_COOKIE_NAME];
    const currentTokenHash = rawToken ? this.tokenService.hashToken(rawToken) : '';
    await this.authService.changePassword(user.id, dto.currentPassword, dto.newPassword, currentTokenHash);
    return { message: 'Password changed.' };
  }
}
