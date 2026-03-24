export const PERMISSIONS = {
  USERS_READ: 'users:read',
  USERS_WRITE: 'users:write',
  USERS_DELETE: 'users:delete',
  USERS_ROLES: 'users:roles',
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
