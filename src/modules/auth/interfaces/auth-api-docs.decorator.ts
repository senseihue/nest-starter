import { applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiUnauthorizedResponse, getSchemaPath } from '@nestjs/swagger';
import { AppErrorResponseDto } from '@/shared/exceptions/app-error.dto';

function buildUnauthorizedSchema(path: string, message: string, code = 'HTTP_EXCEPTION') {
  return {
    allOf: [{ $ref: getSchemaPath(AppErrorResponseDto) }],
    example: {
      statusCode: 401,
      error: 'UnauthorizedException',
      message,
      code,
      path,
      timestamp: '2026-03-17T10:20:00.000Z',
    },
  };
}

export function ApiAuthErrorModel() {
  return applyDecorators(ApiExtraModels(AppErrorResponseDto));
}

export function ApiInvalidCredentialsError() {
  return ApiUnauthorizedResponse({
    description: 'Invalid credentials',
    schema: buildUnauthorizedSchema('/api/auth/login', 'Invalid credentials', 'INVALID_CREDENTIALS'),
  });
}

export function ApiInvalidAccessTokenError() {
  return ApiUnauthorizedResponse({
    description: 'Missing, invalid, expired, or revoked access token',
    schema: buildUnauthorizedSchema('/api/auth/logout', 'Unauthorized'),
  });
}
