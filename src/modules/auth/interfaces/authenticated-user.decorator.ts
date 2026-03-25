import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthSessionUser } from '@/modules/auth/interfaces/auth-session-user';

export const AuthenticatedUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as AuthSessionUser;
  },
);
