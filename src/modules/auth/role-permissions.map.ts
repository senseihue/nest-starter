import { PERMISSIONS, Permission } from '@/modules/auth/permissions';

export const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  superadmin: Object.values(PERMISSIONS),
  admin: [
    PERMISSIONS.USERS_READ,
    PERMISSIONS.USERS_WRITE,
    PERMISSIONS.USERS_DELETE,
    PERMISSIONS.USERS_ROLES,
  ],
  manager: [PERMISSIONS.USERS_READ, PERMISSIONS.USERS_WRITE],
  user: [],
};

export function resolvePermissions(roles: string[]): Permission[] {
  const permissions = new Set<Permission>();
  roles.forEach((role) => {
    (ROLE_PERMISSIONS[role] ?? []).forEach((permission) => permissions.add(permission));
  });
  return Array.from(permissions);
}
