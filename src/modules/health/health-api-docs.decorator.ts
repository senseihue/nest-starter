import { applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiInternalServerErrorResponse, getSchemaPath } from '@nestjs/swagger';
import { AppErrorResponseDto } from '@/shared/exceptions/app-error.dto';

export function ApiHealthErrorModel() {
  return applyDecorators(ApiExtraModels(AppErrorResponseDto));
}

export function ApiHealthUnexpectedError() {
  return ApiInternalServerErrorResponse({
    description: 'Unexpected error',
    schema: {
      allOf: [{ $ref: getSchemaPath(AppErrorResponseDto) }],
      example: {
        statusCode: 500,
        error: 'InternalServerError',
        message: 'Unexpected error',
        code: 'INTERNAL_ERROR',
        path: '/api/health',
        timestamp: '2026-03-17T10:20:00.000Z',
      },
    },
  });
}
