"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiHealthErrorModel = ApiHealthErrorModel;
exports.ApiHealthUnexpectedError = ApiHealthUnexpectedError;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_error_dto_1 = require("../../shared/exceptions/app-error.dto");
function ApiHealthErrorModel() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiExtraModels)(app_error_dto_1.AppErrorResponseDto));
}
function ApiHealthUnexpectedError() {
    return (0, swagger_1.ApiInternalServerErrorResponse)({
        description: 'Unexpected error',
        schema: {
            allOf: [{ $ref: (0, swagger_1.getSchemaPath)(app_error_dto_1.AppErrorResponseDto) }],
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
//# sourceMappingURL=health-api-docs.decorator.js.map