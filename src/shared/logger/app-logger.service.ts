import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppLoggerService {
  private readonly logger = new Logger('App');

  info(message: string, meta?: Record<string, unknown>) {
    if (meta && Object.keys(meta).length > 0) {
      this.logger.log(`${message} ${JSON.stringify(meta)}`);
      return;
    }
    this.logger.log(message);
  }

  warn(message: string, meta?: Record<string, unknown>) {
    if (meta && Object.keys(meta).length > 0) {
      this.logger.warn(`${message} ${JSON.stringify(meta)}`);
      return;
    }
    this.logger.warn(message);
  }

  error(message: string, meta?: Record<string, unknown>) {
    if (meta && Object.keys(meta).length > 0) {
      this.logger.error(`${message} ${JSON.stringify(meta)}`);
      return;
    }
    this.logger.error(message);
  }
}
