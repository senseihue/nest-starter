"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.USERS_EMPTY_ROLES = exports.USERS_DEFAULTS = exports.USERS_RESPONSE_DESCRIPTIONS = exports.USERS_OPERATION_DESCRIPTIONS = exports.USERS_OPERATION_SUMMARIES = exports.USERS_ROUTES = exports.USERS_CONTROLLER_BASE_PATH = exports.USERS_CONTROLLER_TAG = void 0;
exports.USERS_CONTROLLER_TAG = 'users';
exports.USERS_CONTROLLER_BASE_PATH = 'users';
exports.USERS_ROUTES = {
    DETAIL: ':id',
    ROLES: ':id/roles',
    PROFILE: 'me/profile',
};
exports.USERS_OPERATION_SUMMARIES = {
    CREATE: 'Create user (no password)',
    LIST: 'List users',
    GET_BY_ID: 'Get user by id',
    UPDATE: 'Update user',
    UPDATE_ROLES: 'Update user roles',
    REMOVE: 'Remove user',
    GET_PROFILE: 'Get current user profile',
};
exports.USERS_OPERATION_DESCRIPTIONS = {
    CREATE: 'No auth required',
    LIST: 'Requires permission: users:read',
    GET_BY_ID: 'Requires JWT',
    UPDATE: 'Requires permission: users:write',
    UPDATE_ROLES: 'Requires permission: users:roles',
    REMOVE: 'Requires permission: users:delete',
    GET_PROFILE: 'Requires JWT',
};
exports.USERS_RESPONSE_DESCRIPTIONS = {
    CREATE: 'Created user',
    LIST: 'List of users',
    GET_BY_ID: 'User details',
    UPDATE: 'Updated user',
    UPDATE_ROLES: 'Updated user roles',
    REMOVE: 'User removed',
    GET_PROFILE: 'Current user profile',
};
exports.USERS_DEFAULTS = {
    PAGE: 1,
    LIMIT: 20,
    PASSWORD_HASH_ROUNDS: 12,
};
exports.USERS_EMPTY_ROLES = [];
//# sourceMappingURL=users.constants.js.map