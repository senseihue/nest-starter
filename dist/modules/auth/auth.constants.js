"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AUTH_SUCCESS_RESPONSES = exports.AUTH_DEFAULTS = exports.AUTH_TOKEN_PAYLOAD_KEYS = exports.AUTH_RESPONSE_DESCRIPTIONS = exports.AUTH_OPERATION_DESCRIPTIONS = exports.AUTH_OPERATION_SUMMARIES = exports.AUTH_ROUTES = exports.AUTH_CONTROLLER_BASE_PATH = exports.AUTH_CONTROLLER_TAG = void 0;
exports.AUTH_CONTROLLER_TAG = 'auth';
exports.AUTH_CONTROLLER_BASE_PATH = 'auth';
exports.AUTH_ROUTES = {
    REGISTER: 'register',
    LOGIN: 'login',
    LOGOUT: 'logout',
};
exports.AUTH_OPERATION_SUMMARIES = {
    REGISTER: 'Register user',
    LOGIN: 'Login',
    LOGOUT: 'Logout',
};
exports.AUTH_OPERATION_DESCRIPTIONS = {
    REGISTER: 'Creates user with password',
    LOGIN: 'Returns JWT access token',
    LOGOUT: 'Revokes current access token',
};
exports.AUTH_RESPONSE_DESCRIPTIONS = {
    REGISTER: 'Registered user',
    LOGIN: 'JWT access token',
    LOGOUT: 'Logged out successfully',
};
exports.AUTH_TOKEN_PAYLOAD_KEYS = {
    SUBJECT: 'sub',
    TOKEN_ID: 'jti',
};
exports.AUTH_DEFAULTS = {
    ACCESS_TOKEN_EXPIRES_IN: '15m',
    PASSWORD_HASH_ROUNDS: 12,
};
exports.AUTH_SUCCESS_RESPONSES = {
    LOGOUT: {
        success: true,
    },
};
//# sourceMappingURL=auth.constants.js.map