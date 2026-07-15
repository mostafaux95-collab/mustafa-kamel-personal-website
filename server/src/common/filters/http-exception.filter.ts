import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Response } from 'express';

interface ErrorEnvelope {
  success: false;
  statusCode: number;
  message: string;
  errors?: unknown;
  path: string;
  timestamp: string;
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<{ url: string }>();
    const status = exception.getStatus();
    const body = exception.getResponse();

    const isValidationShape =
      typeof body === 'object' && body !== null && 'message' in body;

    const envelope: ErrorEnvelope = {
      success: false,
      statusCode: status,
      message: isValidationShape
        ? Array.isArray((body as { message: unknown }).message)
          ? 'Validation failed'
          : String((body as { message: unknown }).message)
        : exception.message,
      errors: isValidationShape && Array.isArray((body as { message: unknown }).message)
        ? (body as { message: unknown }).message
        : undefined,
      path: request.url,
      timestamp: new Date().toISOString(),
    };

    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(`${request.url} -> ${envelope.message}`, exception.stack);
    }

    response.status(status).json(envelope);
  }
}
