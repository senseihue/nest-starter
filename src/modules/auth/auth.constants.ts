export const AUTH_CONTROLLER_TAG = 'auth';
export const AUTH_CONTROLLER_BASE_PATH = 'auth';
export const AUTH_ROUTES = {
  REGISTER: 'register',
  LOGIN: 'login',
  LOGOUT: 'logout',
} as const;

export const AUTH_OPERATION_SUMMARIES = {
  REGISTER: 'Register user',
  LOGIN: 'Login',
  LOGOUT: 'Logout',
} as const;

export const AUTH_OPERATION_DESCRIPTIONS = {
  REGISTER: 'Creates user with password',
  LOGIN: 'Returns JWT access token',
  LOGOUT: 'Revokes current access token',
} as const;

export const AUTH_RESPONSE_DESCRIPTIONS = {
  REGISTER: 'Registered user',
  LOGIN: 'JWT access token',
  LOGOUT: 'Logged out successfully',
} as const;

export const AUTH_TOKEN_PAYLOAD_KEYS = {
  SUBJECT: 'sub',
  TOKEN_ID: 'jti',
} as const;

export const AUTH_DEFAULTS = {
  ACCESS_TOKEN_EXPIRES_IN: '15m',
  PASSWORD_HASH_ROUNDS: 12,
} as const;

export const AUTH_SUCCESS_RESPONSES = {
  LOGOUT: {
    success: true,
  },
} as const;
