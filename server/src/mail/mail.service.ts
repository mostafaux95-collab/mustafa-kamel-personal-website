import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { AppConfig } from '../config/configuration';

// Provider-agnostic mail interface. Phase 1 ships only the console-log dev
// transport so the auth flows (invite/verify/reset) are fully runnable
// without a live email-provider account; swapping in Resend/SMTP later is
// a change to this one file's transport, not to any calling code.
@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly config: ConfigService<AppConfig, true>) {}

  async sendInviteEmail(to: string, setPasswordUrl: string): Promise<void> {
    await this.send(to, 'You have been invited to the portfolio CMS', [
      `An account was created for you.`,
      `Set your password: ${setPasswordUrl}`,
    ]);
  }

  async sendVerificationEmail(to: string, verifyUrl: string): Promise<void> {
    await this.send(to, 'Verify your email', [`Confirm your email: ${verifyUrl}`]);
  }

  async sendPasswordResetEmail(to: string, resetUrl: string): Promise<void> {
    await this.send(to, 'Reset your password', [
      `Reset your password: ${resetUrl}`,
      `If you didn't request this, you can ignore this email.`,
    ]);
  }

  async sendContactNotification(
    to: string,
    submission: { name: string; email: string; whatsapp?: string; message: string },
  ): Promise<void> {
    await this.send(to, `New contact form message from ${submission.name}`, [
      `Name: ${submission.name}`,
      `Email: ${submission.email}`,
      ...(submission.whatsapp ? [`WhatsApp: ${submission.whatsapp}`] : []),
      '',
      submission.message,
    ]);
  }

  private async send(to: string, subject: string, lines: string[]): Promise<void> {
    const transport = this.config.get('mail.transport', { infer: true });
    const from = this.config.get('mail.from', { infer: true });

    if (transport === 'console') {
      this.logger.log(
        [
          '----- DEV MAIL -----',
          `From: ${from}`,
          `To: ${to}`,
          `Subject: ${subject}`,
          ...lines,
          '---------------------',
        ].join('\n'),
      );
      return;
    }

    // No other transport is wired up in Phase 1 (see plan: real provider
    // is a deploy-time decision, not a Phase 1 blocker).
    throw new Error(`Unsupported mail transport: ${transport}`);
  }
}
