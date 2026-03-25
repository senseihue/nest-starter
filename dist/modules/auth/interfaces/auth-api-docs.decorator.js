"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiAuthErrorModel = ApiAuthErrorModel;
exports.ApiInvalidCredentialsError = ApiInvalidCredentialsError;
exports.ApiInvalidAccessTokenError = ApiInvalidAccessTokenError;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_error_dto_1 = require("../../../shared/exceptions/app-error.dto");
function buildUnauthorizedSchema(path, message, code = 'HTTP_EXCEPTION') {
    return {
        allOf: [{ $ref: (0, swagger_1.getSchemaPath)(app_error_dto_1.AppErrorResponseDto) }],
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
function ApiAuthErrorModel() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiExtraModels)(app_error_dto_1.AppErrorResponseDto));
}
function ApiInvalidCredentialsError() {
    return (0, swagger_1.ApiUnauthorizedResponse)({
        description: 'Invalid credentials',
        schema: buildUnauthorizedSchema('/api/auth/login', 'Invalid credentials', 'INVALID_CREDENTIALS'),
    });
}
function ApiInvalidAccessTokenError() {
    return (0, swagger_1.ApiUnauthorizedResponse)({
        description: 'Missing, invalid, expired, or revoked access token',
        schema: buildUnauthorizedSchema('/api/auth/logout', 'Unauthorized'),
    });
}
//# sourceMappingURL=auth-api-docs.decorator.js.map