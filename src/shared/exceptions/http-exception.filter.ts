import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { AppErrorResponse } from '@/shared/exceptions/app-error';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorName = exception instanceof HttpException
      ? exception.name
      : 'InternalServerError';

    const message = exception instanceof HttpException
      ? this.extractMessage(exception)
      : 'Unexpected error';

    const code = exception instanceof HttpException
      ? (exception.getResponse() as { code?: string }).code ?? 'HTTP_EXCEPTION'
      : 'INTERNAL_ERROR';

    const body: AppErrorResponse = {
      statusCode: status,
      error: errorName,
      message,
      code,
      path: request.url,
      timestamp: new Date().toISOString(),
    };

    response.status(status).json(body);
  }

  private extractMessage(exception: HttpException): string {
    const response = exception.getResponse();
    if (typeof response === 'string') {
      return response;
    }

    if (typeof response === 'object' && response !== null) {
      const message = (response as { message?: string | string[] }).message;
      if (Array.isArray(message)) {
        return message.join(', ');
      }
      if (typeof message === 'string') {
        return message;
      }
    }

    return exception.message || 'Error';
  }
}
