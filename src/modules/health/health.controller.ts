import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiHealthErrorModel, ApiHealthUnexpectedError } from '@/modules/health/health-api-docs.decorator';

@ApiTags('health')
@ApiHealthErrorModel()
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'Health check' })
  @ApiOkResponse({ description: 'Service status' })
  @ApiHealthUnexpectedError()
  getStatus() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
