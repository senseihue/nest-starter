import { applyDecorators } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { PERMISSIONS } from '@/modules/auth/permissions';
import { AppErrorResponseDto } from '@/shared/exceptions/app-error.dto';

function buildErrorSchema(
  statusCode: number,
  error: string,
  path: string,
  message: string,
  code = 'HTTP_EXCEPTION',
) {
  return {
    allOf: [{ $ref: getSchemaPath(AppErrorResponseDto) }],
    example: {
      statusCode,
      error,
      message,
      code,
      path,
      timestamp: '2026-03-17T10:20:00.000Z',
    },
  };
}

export function ApiUsersErrorModel() {
  return applyDecorators(ApiExtraModels(AppErrorResponseDto));
}

export function ApiUsersUnauthorized(path: string) {
  return ApiUnauthorizedResponse({
    description: 'Missing or invalid JWT',
    schema: buildErrorSchema(401, 'UnauthorizedException', path, 'Unauthorized'),
  });
}

export function ApiUsersReadPermissionDenied() {
  return ApiForbiddenResponse({
    description: `Missing permission: ${PERMISSIONS.USERS_READ}`,
    schema: buildErrorSchema(403, 'ForbiddenException', '/api/users', 'Forbidden'),
  });
}

export function ApiUsersWritePermissionDenied() {
  return ApiForbiddenResponse({
    description: `Missing permission: ${PERMISSIONS.USERS_WRITE}`,
    schema: buildErrorSchema(403, 'ForbiddenException', '/api/users/123', 'Forbidden'),
  });
}

export function ApiUsersRolesPermissionDenied() {
  return ApiForbiddenResponse({
    description: `Missing permission: ${PERMISSIONS.USERS_ROLES}`,
    schema: buildErrorSchema(403, 'ForbiddenException', '/api/users/123/roles', 'Forbidden'),
  });
}

export function ApiUsersDeletePermissionDenied() {
  return ApiForbiddenResponse({
    description: `Missing permission: ${PERMISSIONS.USERS_DELETE}`,
    schema: buildErrorSchema(403, 'ForbiddenException', '/api/users/123', 'Forbidden'),
  });
}

export function ApiUserNotFound(path: string) {
  return ApiNotFoundResponse({
    description: 'User not found',
    schema: buildErrorSchema(404, 'NotFoundException', path, 'User not found', 'USER_NOT_FOUND'),
  });
}
