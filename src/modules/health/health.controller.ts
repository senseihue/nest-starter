import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  HEALTH_CONTROLLER_BASE_PATH,
  HEALTH_CONTROLLER_TAG,
  HEALTH_OPERATION_SUMMARY,
  HEALTH_RESPONSE_DESCRIPTION,
} from '@/modules/health/health.constants';
import { ApiHealthErrorModel, ApiHealthUnexpectedError } from '@/modules/health/health-api-docs.decorator';
import { toHealthStatusResponse } from '@/modules/health/health.presenter';

@ApiTags(HEALTH_CONTROLLER_TAG)
@ApiHealthErrorModel()
@Controller(HEALTH_CONTROLLER_BASE_PATH)
export class HealthController {
  @Get()
  @ApiOperation({ summary: HEALTH_OPERATION_SUMMARY })
  @ApiOkResponse({ description: HEALTH_RESPONSE_DESCRIPTION })
  @ApiHealthUnexpectedError()
  getStatus() {
    return toHealthStatusResponse();
  }
}
