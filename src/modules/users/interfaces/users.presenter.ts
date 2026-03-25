import { User } from '@/modules/users/domain/user.entity';
import { buildPaginationMeta } from '@/shared/interceptors/pagination-response';

export function toUserResponse(user: User) {
  return {
    id: user.id,
    name: user.getName(),
    email: user.getEmail(),
  };
}

export function toUserRolesResponse(user: User, roles: string[]) {
  return {
    ...toUserResponse(user),
    roles,
  };
}

export function toUsersPageResponse(users: User[], page: number, limit: number, total: number) {
  return {
    items: users.map(toUserResponse),
    pagination: buildPaginationMeta(page, limit, total),
  };
}

export function toRemoveUserResponse() {
  return { success: true };
}
