import { Controller, Get } from '@nestjs/common';
import { ApiExtraModels, ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { AppErrorResponseDto } from '../../shared/exceptions/app-error.dto';

@ApiTags('health')
@ApiExtraModels(AppErrorResponseDto)
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'Health check' })
  @ApiOkResponse({ description: 'Service status' })
  @ApiInternalServerErrorResponse({
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
  })
  getStatus() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
