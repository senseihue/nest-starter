"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ROLE_PERMISSIONS = void 0;
exports.resolvePermissions = resolvePermissions;
const permissions_1 = require("./permissions");
exports.ROLE_PERMISSIONS = {
    admin: [
        permissions_1.PERMISSIONS.USERS_READ,
        permissions_1.PERMISSIONS.USERS_WRITE,
        permissions_1.PERMISSIONS.USERS_DELETE,
        permissions_1.PERMISSIONS.USERS_ROLES,
    ],
    manager: [permissions_1.PERMISSIONS.USERS_READ, permissions_1.PERMISSIONS.USERS_WRITE],
    user: [],
};
function resolvePermissions(roles) {
    const permissions = new Set();
    roles.forEach((role) => {
        (exports.ROLE_PERMISSIONS[role] ?? []).forEach((permission) => permissions.add(permission));
    });
    return Array.from(permissions);
}
//# sourceMappingURL=role-permissions.map.js.map