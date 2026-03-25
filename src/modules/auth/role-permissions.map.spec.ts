import { PERMISSIONS } from '@/modules/auth/permissions';
import { resolvePermissions, ROLE_PERMISSIONS } from '@/modules/auth/role-permissions.map';

describe('role-permissions.map', () => {
  it('gives superadmin all permissions', () => {
    expect(ROLE_PERMISSIONS.superadmin).toEqual(Object.values(PERMISSIONS));
    expect(resolvePermissions(['superadmin'])).toEqual(Object.values(PERMISSIONS));
  });

  it('deduplicates permissions from multiple roles', () => {
    const resolved = resolvePermissions(['superadmin', 'admin']);

    expect(resolved).toEqual(Object.values(PERMISSIONS));
  });
});
