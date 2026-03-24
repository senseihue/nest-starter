import { Global, Module } from '@nestjs/common';
import { AppLoggerService } from '@/shared/logger/app-logger.service';
import { LogInterceptor } from '@/shared/logger/log.interceptor';

@Global()
@Module({
  providers: [AppLoggerService, LogInterceptor],
  exports: [AppLoggerService, LogInterceptor],
})
export class LoggerModule {}
