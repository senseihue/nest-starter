import { UnauthorizedException } from '@nestjs/common';

export class InvalidCredentialsException extends UnauthorizedException {
  constructor() {
    super({
      message: 'Invalid credentials',
      code: 'INVALID_CREDENTIALS',
    });
  }
}
