import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger } from '@nestjs/common';
import type { Response } from 'express';
import { Prisma } from '../../../generated/prisma/client';

// Maps well-known Prisma error codes to sane HTTP responses so
// repositories/services don't need to catch-and-translate individually.
const CODE_TO_STATUS: Record<string, number> = {
  P2002: HttpStatus.CONFLICT, // unique constraint violation
  P2025: HttpStatus.NOT_FOUND, // record not found
  P2003: HttpStatus.BAD_REQUEST, // foreign key constraint failed
};

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(PrismaExceptionFilter.name);

  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<{ url: string }>();

    const status = CODE_TO_STATUS[exception.code] ?? HttpStatus.INTERNAL_SERVER_ERROR;
    const target = (exception.meta?.target as string[] | undefined)?.join(', ');

    const message =
      exception.code === 'P2002'
        ? `A record with this ${target ?? 'value'} already exists`
        : exception.code === 'P2025'
          ? 'Record not found'
          : 'Database request failed';

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(`${request.url} -> Prisma ${exception.code}`, exception.stack);
    }

    response.status(status).json({
      success: false,
      statusCode: status,
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
