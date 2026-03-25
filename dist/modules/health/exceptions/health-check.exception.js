"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthCheckFailedException = void 0;
const common_1 = require("@nestjs/common");
class HealthCheckFailedException extends common_1.ServiceUnavailableException {
    constructor() {
        super({
            message: 'Health check failed',
            code: 'HEALTH_CHECK_FAILED',
        });
    }
}
exports.HealthCheckFailedException = HealthCheckFailedException;
//# sourceMappingURL=health-check.exception.js.map