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
const user_not_found_exception_1 = require("../exceptions/user-not-found.exception");
const users_api_docs_decorator_1 = require("./users-api-docs.decorator");
const create_user_dto_1 = require("./create-user.dto");
const list_users_query_1 = require("./list-users.query");
const update_user_dto_1 = require("./update-user.dto");
const update_user_roles_dto_1 = require("./update-user-roles.dto");
const pagination_response_1 = require("../../../shared/interceptors/pagination-response");
const log_decorator_1 = require("../../../shared/logger/log.decorator");
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    async create(dto) {
        const user = await this.usersService.createUser(dto.id, dto.name, dto.email);
        return {
            id: user.id,
            name: user.getName(),
            email: user.getEmail(),
        };
    }
    async list(query) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 20;
        const { items, total } = await this.usersService.listUsersPage(page, limit);
        return {
            items: items.map((user) => ({
                id: user.id,
                name: user.getName(),
                email: user.getEmail(),
            })),
            pagination: (0, pagination_response_1.buildPaginationMeta)(page, limit, total),
        };
    }
    async getById(id) {
        const user = await this.usersService.getUser(id);
        if (!user) {
            throw new user_not_found_exception_1.UserNotFoundException();
        }
        return {
            id: user.id,
            name: user.getName(),
            email: user.getEmail(),
        };
    }
    async update(id, dto) {
        const updated = await this.usersService.updateUser(id, dto);
        if (!updated) {
            throw new user_not_found_exception_1.UserNotFoundException();
        }
        return {
            id: updated.id,
            name: updated.getName(),
            email: updated.getEmail(),
        };
    }
    async updateRoles(id, dto) {
        const updated = await this.usersService.updateUserRoles(id, dto.roles);
        if (!updated) {
            throw new user_not_found_exception_1.UserNotFoundException();
        }
        return {
            id: updated.id,
            name: updated.getName(),
            email: updated.getEmail(),
            roles: dto.roles,
        };
    }
    async remove(id) {
        const removed = await this.usersService.removeUser(id);
        if (!removed) {
            throw new user_not_found_exception_1.UserNotFoundException();
        }
        return { success: true };
    }
    getProfile(user) {
        return user;
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create user (no password)', description: 'No auth required' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Created user' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.Permissions)(permissions_1.PERMISSIONS.USERS_READ),
    (0, log_decorator_1.Loggable)('Users list'),
    (0, swagger_1.ApiOperation)({ summary: 'List users', description: 'Requires permission: users:read' }),
    (0, swagger_1.ApiOkResponse)({ description: 'List of users' }),
    (0, users_api_docs_decorator_1.ApiUsersUnauthorized)('/api/users'),
    (0, users_api_docs_decorator_1.ApiUsersReadPermissionDenied)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [list_users_query_1.ListUsersQuery]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get user by id', description: 'Requires JWT' }),
    (0, swagger_1.ApiOkResponse)({ description: 'User details' }),
    (0, users_api_docs_decorator_1.ApiUsersUnauthorized)('/api/users/123'),
    (0, users_api_docs_decorator_1.ApiUserNotFound)('/api/users/123'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getById", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.Permissions)(permissions_1.PERMISSIONS.USERS_WRITE),
    (0, swagger_1.ApiOperation)({ summary: 'Update user', description: 'Requires permission: users:write' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Updated user' }),
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
    (0, common_1.Patch)(':id/roles'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.Permissions)(permissions_1.PERMISSIONS.USERS_ROLES),
    (0, swagger_1.ApiOperation)({ summary: 'Update user roles', description: 'Requires permission: users:roles' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Updated user roles' }),
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
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.Permissions)(permissions_1.PERMISSIONS.USERS_DELETE),
    (0, swagger_1.ApiOperation)({ summary: 'Remove user', description: 'Requires permission: users:delete' }),
    (0, swagger_1.ApiOkResponse)({ description: 'User removed' }),
    (0, users_api_docs_decorator_1.ApiUsersUnauthorized)('/api/users/123'),
    (0, users_api_docs_decorator_1.ApiUsersDeletePermissionDenied)(),
    (0, users_api_docs_decorator_1.ApiUserNotFound)('/api/users/123'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('me/profile'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get current user profile', description: 'Requires JWT' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Current user profile' }),
    (0, users_api_docs_decorator_1.ApiUsersUnauthorized)('/api/users/me/profile'),
    __param(0, (0, authenticated_user_decorator_1.AuthenticatedUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getProfile", null);
exports.UsersController = UsersController = __decorate([
    (0, swagger_1.ApiTags)('users'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, users_api_docs_decorator_1.ApiUsersErrorModel)(),
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map