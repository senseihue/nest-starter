"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiUsersErrorModel = ApiUsersErrorModel;
exports.ApiUsersUnauthorized = ApiUsersUnauthorized;
exports.ApiUsersReadPermissionDenied = ApiUsersReadPermissionDenied;
exports.ApiUsersWritePermissionDenied = ApiUsersWritePermissionDenied;
exports.ApiUsersRolesPermissionDenied = ApiUsersRolesPermissionDenied;
exports.ApiUsersDeletePermissionDenied = ApiUsersDeletePermissionDenied;
exports.ApiUserNotFound = ApiUserNotFound;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const permissions_1 = require("../../auth/permissions");
const app_error_dto_1 = require("../../../shared/exceptions/app-error.dto");
function buildErrorSchema(statusCode, error, path, message, code = 'HTTP_EXCEPTION') {
    return {
        allOf: [{ $ref: (0, swagger_1.getSchemaPath)(app_error_dto_1.AppErrorResponseDto) }],
        example: {
            statusCode,
            error,
            message,
            code,
            path,
            timestamp: '2026-03-17T10:20:00.000Z',
        },
    };
}
function ApiUsersErrorModel() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiExtraModels)(app_error_dto_1.AppErrorResponseDto));
}
function ApiUsersUnauthorized(path) {
    return (0, swagger_1.ApiUnauthorizedResponse)({
        description: 'Missing or invalid JWT',
        schema: buildErrorSchema(401, 'UnauthorizedException', path, 'Unauthorized'),
    });
}
function ApiUsersReadPermissionDenied() {
    return (0, swagger_1.ApiForbiddenResponse)({
        description: `Missing permission: ${permissions_1.PERMISSIONS.USERS_READ}`,
        schema: buildErrorSchema(403, 'ForbiddenException', '/api/users', 'Forbidden'),
    });
}
function ApiUsersWritePermissionDenied() {
    return (0, swagger_1.ApiForbiddenResponse)({
        description: `Missing permission: ${permissions_1.PERMISSIONS.USERS_WRITE}`,
        schema: buildErrorSchema(403, 'ForbiddenException', '/api/users/123', 'Forbidden'),
    });
}
function ApiUsersRolesPermissionDenied() {
    return (0, swagger_1.ApiForbiddenResponse)({
        description: `Missing permission: ${permissions_1.PERMISSIONS.USERS_ROLES}`,
        schema: buildErrorSchema(403, 'ForbiddenException', '/api/users/123/roles', 'Forbidden'),
    });
}
function ApiUsersDeletePermissionDenied() {
    return (0, swagger_1.ApiForbiddenResponse)({
        description: `Missing permission: ${permissions_1.PERMISSIONS.USERS_DELETE}`,
        schema: buildErrorSchema(403, 'ForbiddenException', '/api/users/123', 'Forbidden'),
    });
}
function ApiUserNotFound(path) {
    return (0, swagger_1.ApiNotFoundResponse)({
        description: 'User not found',
        schema: buildErrorSchema(404, 'NotFoundException', path, 'User not found', 'USER_NOT_FOUND'),
    });
}
//# sourceMappingURL=users-api-docs.decorator.js.map