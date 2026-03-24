import { ServiceUnavailableException } from '@nestjs/common';

export class HealthCheckFailedException extends ServiceUnavailableException {
  constructor() {
    super({
      message: 'Health check failed',
      code: 'HEALTH_CHECK_FAILED',
    });
  }
}
