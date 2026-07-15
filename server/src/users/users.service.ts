import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'node:crypto';
import { UsersRepository } from './users.repository';
import { AuthService } from '../auth/auth.service';
import { MailService } from '../mail/mail.service';
import type { AppConfig } from '../config/configuration';
import type { CreateUserInviteDto } from './dto/create-user-invite.dto';
import type { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly authService: AuthService,
    private readonly mailService: MailService,
    private readonly config: ConfigService<AppConfig, true>,
  ) {}

  async invite(dto: CreateUserInviteDto, actorId: string) {
    const existing = await this.usersRepository.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('A user with this email already exists');
    }

    // Unusable placeholder hash — the invitee sets a real password via the
    // reset-password link below before they can ever log in.
    const placeholderHash = await bcrypt.hash(randomBytes(32).toString('hex'), 12);

    const user = await this.usersRepository.create(
      {
        email: dto.email,
        firstName: dto.firstName,
        lastName: dto.lastName,
        role: dto.role,
        passwordHash: placeholderHash,
      },
      actorId,
    );

    const token = await this.authService.issuePasswordResetToken(user.id);
    const appUrl = this.config.get('appUrl', { infer: true });
    await this.mailService.sendInviteEmail(user.email, `${appUrl}/reset-password?token=${token}`);

    return this.toSafeUser(user);
  }

  async findById(id: string) {
    const user = await this.usersRepository.findUnique({ where: { id } });
    if (!user || user.deletedAt) {
      throw new NotFoundException('User not found');
    }
    return this.toSafeUser(user);
  }

  async list() {
    const users: Record<string, unknown>[] = await this.usersRepository.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return users.map((u) => this.toSafeUser(u));
  }

  async update(id: string, dto: UpdateUserDto, actorId: string) {
    await this.findById(id);
    const user = await this.usersRepository.update({ id }, dto, actorId);
    return this.toSafeUser(user);
  }

  async deactivate(id: string, actorId: string) {
    await this.findById(id);
    const user = await this.usersRepository.update({ id }, { isActive: false }, actorId);
    return this.toSafeUser(user);
  }

  // Never return passwordHash/reset-tokens/2FA secrets to the client.
  private toSafeUser(user: Record<string, unknown>) {
    const {
      passwordHash: _passwordHash,
      passwordResetToken: _passwordResetToken,
      emailVerifyToken: _emailVerifyToken,
      twoFactorSecret: _twoFactorSecret,
      twoFactorRecoveryCodes: _twoFactorRecoveryCodes,
      ...safe
    } = user;
    return safe;
  }
}
