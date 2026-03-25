import { HEALTH_STATUS_OK } from '@/modules/health/health.constants';

export function toHealthStatusResponse() {
  return {
    status: HEALTH_STATUS_OK,
    timestamp: new Date().toISOString(),
  };
}
