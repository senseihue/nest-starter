"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const permissions_decorator_1 = require("../../auth/guards/permissions.decorator");
const permissions_guard_1 = require("../../auth/guards/permissions.guard");
const authenticated_user_decorator_1 = require("../../auth/interfaces/authenticated-user.decorator");
const permissions_1 = require("../../auth/permissions");
const users_service_1 = require("../application/users.service");
const users_constants_1 = require("../users.constants");
const user_not_found_exception_1 = require("../exceptions/user-not-found.exception");
const users_api_docs_decorator_1 = require("./users-api-docs.decorator");
const create_user_dto_1 = require("./create-user.dto");
const list_users_query_1 = require("./list-users.query");
const users_presenter_1 = require("./users.presenter");
const update_user_dto_1 = require("./update-user.dto");
const update_user_roles_dto_1 = require("./update-user-roles.dto");
const users_log_events_1 = require("../users-log-events");
const log_decorator_1 = require("../../../shared/logger/log.decorator");
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    async create(dto) {
        const user = await this.usersService.createUser(dto.id, dto.name, dto.email);
        return (0, users_presenter_1.toUserResponse)(user);
    }
    async list(query) {
        const page = query.page ?? users_constants_1.USERS_DEFAULTS.PAGE;
        const limit = query.limit ?? users_constants_1.USERS_DEFAULTS.LIMIT;
        const { items, total } = await this.usersService.listUsersPage(page, limit);
        return (0, users_presenter_1.toUsersPageResponse)(items, page, limit, total);
    }
    async getById(id) {
        const user = await this.usersService.getUser(id);
        if (!user) {
            throw new user_not_found_exception_1.UserNotFoundException();
        }
        return (0, users_presenter_1.toUserResponse)(user);
    }
    async update(id, dto) {
        const updated = await this.usersService.updateUser(id, dto);
        if (!updated) {
            throw new user_not_found_exception_1.UserNotFoundException();
        }
        return (0, users_presenter_1.toUserResponse)(updated);
    }
    async updateRoles(id, dto) {
        const updated = await this.usersService.updateUserRoles(id, dto.roles);
        if (!updated) {
            throw new user_not_found_exception_1.UserNotFoundException();
        }
        return (0, users_presenter_1.toUserRolesResponse)(updated, dto.roles);
    }
    async remove(id) {
        const removed = await this.usersService.removeUser(id);
        if (!removed) {
            throw new user_not_found_exception_1.UserNotFoundException();
        }
        return (0, users_presenter_1.toRemoveUserResponse)();
    }
    getProfile(user) {
        return user;
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({
        summary: users_constants_1.USERS_OPERATION_SUMMARIES.CREATE,
        description: users_constants_1.USERS_OPERATION_DESCRIPTIONS.CREATE,
    }),
    (0, swagger_1.ApiOkResponse)({ description: users_constants_1.USERS_RESPONSE_DESCRIPTIONS.CREATE }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.Permissions)(permissions_1.PERMISSIONS.USERS_READ),
    (0, log_decorator_1.Loggable)(users_log_events_1.USERS_LOG_EVENTS.LIST),
    (0, swagger_1.ApiOperation)({
        summary: users_constants_1.USERS_OPERATION_SUMMARIES.LIST,
        description: users_constants_1.USERS_OPERATION_DESCRIPTIONS.LIST,
    }),
    (0, swagger_1.ApiOkResponse)({ description: users_constants_1.USERS_RESPONSE_DESCRIPTIONS.LIST }),
    (0, users_api_docs_decorator_1.ApiUsersUnauthorized)('/api/users'),
    (0, users_api_docs_decorator_1.ApiUsersReadPermissionDenied)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [list_users_query_1.ListUsersQuery]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(users_constants_1.USERS_ROUTES.DETAIL),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: users_constants_1.USERS_OPERATION_SUMMARIES.GET_BY_ID,
        description: users_constants_1.USERS_OPERATION_DESCRIPTIONS.GET_BY_ID,
    }),
    (0, swagger_1.ApiOkResponse)({ description: users_constants_1.USERS_RESPONSE_DESCRIPTIONS.GET_BY_ID }),
    (0, users_api_docs_decorator_1.ApiUsersUnauthorized)('/api/users/123'),
    (0, users_api_docs_decorator_1.ApiUserNotFound)('/api/users/123'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getById", null);
__decorate([
    (0, common_1.Patch)(users_constants_1.USERS_ROUTES.DETAIL),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.Permissions)(permissions_1.PERMISSIONS.USERS_WRITE),
    (0, swagger_1.ApiOperation)({
        summary: users_constants_1.USERS_OPERATION_SUMMARIES.UPDATE,
        description: users_constants_1.USERS_OPERATION_DESCRIPTIONS.UPDATE,
    }),
    (0, swagger_1.ApiOkResponse)({ description: users_constants_1.USERS_RESPONSE_DESCRIPTIONS.UPDATE }),
    (0, users_api_docs_decorator_1.ApiUsersUnauthorized)('/api/users/123'),
    (0, users_api_docs_decorator_1.ApiUsersWritePermissionDenied)(),
    (0, users_api_docs_decorator_1.ApiUserNotFound)('/api/users/123'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(users_constants_1.USERS_ROUTES.ROLES),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.Permissions)(permissions_1.PERMISSIONS.USERS_ROLES),
    (0, swagger_1.ApiOperation)({
        summary: users_constants_1.USERS_OPERATION_SUMMARIES.UPDATE_ROLES,
        description: users_constants_1.USERS_OPERATION_DESCRIPTIONS.UPDATE_ROLES,
    }),
    (0, swagger_1.ApiOkResponse)({ description: users_constants_1.USERS_RESPONSE_DESCRIPTIONS.UPDATE_ROLES }),
    (0, users_api_docs_decorator_1.ApiUsersUnauthorized)('/api/users/123/roles'),
    (0, users_api_docs_decorator_1.ApiUsersRolesPermissionDenied)(),
    (0, users_api_docs_decorator_1.ApiUserNotFound)('/api/users/123/roles'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_user_roles_dto_1.UpdateUserRolesDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateRoles", null);
__decorate([
    (0, common_1.Delete)(users_constants_1.USERS_ROUTES.DETAIL),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.Permissions)(permissions_1.PERMISSIONS.USERS_DELETE),
    (0, swagger_1.ApiOperation)({
        summary: users_constants_1.USERS_OPERATION_SUMMARIES.REMOVE,
        description: users_constants_1.USERS_OPERATION_DESCRIPTIONS.REMOVE,
    }),
    (0, swagger_1.ApiOkResponse)({ description: users_constants_1.USERS_RESPONSE_DESCRIPTIONS.REMOVE }),
    (0, users_api_docs_decorator_1.ApiUsersUnauthorized)('/api/users/123'),
    (0, users_api_docs_decorator_1.ApiUsersDeletePermissionDenied)(),
    (0, users_api_docs_decorator_1.ApiUserNotFound)('/api/users/123'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(users_constants_1.USERS_ROUTES.PROFILE),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: users_constants_1.USERS_OPERATION_SUMMARIES.GET_PROFILE,
        description: users_constants_1.USERS_OPERATION_DESCRIPTIONS.GET_PROFILE,
    }),
    (0, swagger_1.ApiOkResponse)({ description: users_constants_1.USERS_RESPONSE_DESCRIPTIONS.GET_PROFILE }),
    (0, users_api_docs_decorator_1.ApiUsersUnauthorized)('/api/users/me/profile'),
    __param(0, (0, authenticated_user_decorator_1.AuthenticatedUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getProfile", null);
exports.UsersController = UsersController = __decorate([
    (0, swagger_1.ApiTags)(users_constants_1.USERS_CONTROLLER_TAG),
    (0, swagger_1.ApiBearerAuth)(),
    (0, users_api_docs_decorator_1.ApiUsersErrorModel)(),
    (0, common_1.Controller)(users_constants_1.USERS_CONTROLLER_BASE_PATH),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map