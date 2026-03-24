import { SetMetadata } from '@nestjs/common';

export const LOGGABLE_KEY = 'loggable';

export interface LoggableConfig {
  message?: string;
}

export const Loggable = (message?: string) =>
  SetMetadata(LOGGABLE_KEY, { message } as LoggableConfig);
