import { Injectable } from '@nestjs/common';

type LogLevel = 'info' | 'warn' | 'error';
const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  info: 20,
  warn: 30,
  error: 40,
};

@Injectable()
export class AppLoggerService {
  private readonly nodeEnv = process.env.NODE_ENV ?? 'development';
  private readonly logLevel = this.parseLogLevel(process.env.LOG_LEVEL);

  info(message: string, meta?: Record<string, unknown>) {
    this.write('info', message, meta);
  }

  warn(message: string, meta?: Record<string, unknown>) {
    this.write('warn', message, meta);
  }

  error(message: string, meta?: Record<string, unknown>) {
    this.write('error', message, meta);
  }

  private write(level: LogLevel, message: string, meta?: Record<string, unknown>) {
    if (!this.shouldLog(level)) {
      return;
    }

    // Move log serialization and I/O off the main request path.
    setImmediate(() => {
      if (this.nodeEnv === 'production') {
        this.writeJsonl(level, message, meta);
        return;
      }

      this.writePretty(level, message, meta);
    });
  }

  private writePretty(level: LogLevel, message: string, meta?: Record<string, unknown>) {
    const text = meta && Object.keys(meta).length > 0
      ? `${message} ${this.formatPrettyMeta(meta)}`
      : message;

    const line = `[${new Date().toISOString()}] ${level.toUpperCase()} App ${text}`;
    this.emit(level, line);
  }

  private writeJsonl(level: LogLevel, message: string, meta?: Record<string, unknown>) {
    const payload = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context: 'App',
      ...(meta ?? {}),
    };

    this.emit(level, JSON.stringify(payload));
  }

  private emit(level: LogLevel, message: string) {
    const stream = level === 'error' ? process.stderr : process.stdout;
    stream.write(`${message}\n`);
  }

  private shouldLog(level: LogLevel) {
    return LOG_LEVEL_PRIORITY[level] >= LOG_LEVEL_PRIORITY[this.logLevel];
  }

  private parseLogLevel(value?: string): LogLevel {
    if (value === 'warn' || value === 'error' || value === 'info') {
      return value;
    }

    return 'info';
  }

  private formatPrettyMeta(meta: Record<string, unknown>) {
    return Object.entries(meta)
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) => `${key}=${this.stringifyValue(value)}`)
      .join(' ');
  }

  private stringifyValue(value: unknown) {
    if (typeof value === 'string') {
      return value.includes(' ') ? `"${value}"` : value;
    }

    return JSON.stringify(value);
  }
}
