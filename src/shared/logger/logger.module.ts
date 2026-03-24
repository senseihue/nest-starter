import { Global, Module } from '@nestjs/common';
import { AppLoggerService } from './app-logger.service';
import { LogInterceptor } from './log.interceptor';

@Global()
@Module({
  providers: [AppLoggerService, LogInterceptor],
  exports: [AppLoggerService, LogInterceptor],
})
export class LoggerModule {}
