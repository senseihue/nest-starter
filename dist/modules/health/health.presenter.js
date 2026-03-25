"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toHealthStatusResponse = toHealthStatusResponse;
const health_constants_1 = require("./health.constants");
function toHealthStatusResponse() {
    return {
        status: health_constants_1.HEALTH_STATUS_OK,
        timestamp: new Date().toISOString(),
    };
}
//# sourceMappingURL=health.presenter.js.map