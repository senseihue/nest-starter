import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AppLoggerService } from '@/shared/logger/app-logger.service';
import { LOGGABLE_KEY, LoggableConfig } from '@/shared/logger/log.decorator';

@Injectable()
export class LogInterceptor implements NestInterceptor {
  private readonly requestLoggingEnabled = process.env.REQUEST_LOGGING_ENABLED !== 'false';

  constructor(
    private readonly reflector: Reflector,
    private readonly logger: AppLoggerService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const config = this.reflector.getAllAndOverride<LoggableConfig | undefined>(LOGGABLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!config || !this.requestLoggingEnabled) {
      return next.handle();
    }

    const http = context.switchToHttp();
    const request = http.getRequest();
    const start = Date.now();

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - start;
        const user = request.user as { userId?: string; email?: string } | undefined;
        const forwardedFor = request.headers['x-forwarded-for'];
        const ip = Array.isArray(forwardedFor)
          ? forwardedFor[0]
          : forwardedFor?.split(',')[0]?.trim() || request.ip;
        const userAgent = request.headers['user-agent'];
        this.logger.info(config.message ?? 'Request handled', {
          method: request.method,
          path: request.url,
          durationMs: duration,
          userId: user?.userId,
          email: user?.email,
          ip,
          userAgent,
        });
      }),
    );
  }
}
