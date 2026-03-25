import { User } from '@/modules/users/domain/user.entity';

export function toAuthUserResponse(user: User) {
  return {
    id: user.id,
    name: user.getName(),
    email: user.getEmail(),
  };
}
