import { NotFoundException } from '@nestjs/common';

export class UserNotFoundException extends NotFoundException {
  constructor() {
    super({
      message: 'User not found',
      code: 'USER_NOT_FOUND',
    });
  }
}
