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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_service_1 = require("../application/auth.service");
const auth_constants_1 = require("../auth.constants");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
const auth_log_events_1 = require("../auth-log-events");
const auth_api_docs_decorator_1 = require("./auth-api-docs.decorator");
const auth_presenter_1 = require("./auth.presenter");
const authenticated_user_decorator_1 = require("./authenticated-user.decorator");
const login_dto_1 = require("./login.dto");
const register_user_dto_1 = require("./register-user.dto");
const log_decorator_1 = require("../../../shared/logger/log.decorator");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async register(dto) {
        const user = await this.authService.register(dto.id, dto.name, dto.email, dto.password);
        return (0, auth_presenter_1.toAuthUserResponse)(user);
    }
    async login(dto) {
        const user = await this.authService.validateUser(dto.email, dto.password);
        return this.authService.login(user);
    }
    async logout(user) {
        return this.authService.logout(user);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)(auth_constants_1.AUTH_ROUTES.REGISTER),
    (0, log_decorator_1.Loggable)(auth_log_events_1.AUTH_LOG_EVENTS.REGISTER),
    (0, swagger_1.ApiOperation)({
        summary: auth_constants_1.AUTH_OPERATION_SUMMARIES.REGISTER,
        description: auth_constants_1.AUTH_OPERATION_DESCRIPTIONS.REGISTER,
    }),
    (0, swagger_1.ApiOkResponse)({ description: auth_constants_1.AUTH_RESPONSE_DESCRIPTIONS.REGISTER }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_user_dto_1.RegisterUserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)(auth_constants_1.AUTH_ROUTES.LOGIN),
    (0, log_decorator_1.Loggable)(auth_log_events_1.AUTH_LOG_EVENTS.LOGIN),
    (0, swagger_1.ApiOperation)({
        summary: auth_constants_1.AUTH_OPERATION_SUMMARIES.LOGIN,
        description: auth_constants_1.AUTH_OPERATION_DESCRIPTIONS.LOGIN,
    }),
    (0, swagger_1.ApiOkResponse)({ description: auth_constants_1.AUTH_RESPONSE_DESCRIPTIONS.LOGIN }),
    (0, auth_api_docs_decorator_1.ApiInvalidCredentialsError)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)(auth_constants_1.AUTH_ROUTES.LOGOUT),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, log_decorator_1.Loggable)(auth_log_events_1.AUTH_LOG_EVENTS.LOGOUT),
    (0, swagger_1.ApiOperation)({
        summary: auth_constants_1.AUTH_OPERATION_SUMMARIES.LOGOUT,
        description: auth_constants_1.AUTH_OPERATION_DESCRIPTIONS.LOGOUT,
    }),
    (0, swagger_1.ApiOkResponse)({ description: auth_constants_1.AUTH_RESPONSE_DESCRIPTIONS.LOGOUT }),
    (0, auth_api_docs_decorator_1.ApiInvalidAccessTokenError)(),
    __param(0, (0, authenticated_user_decorator_1.AuthenticatedUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)(auth_constants_1.AUTH_CONTROLLER_TAG),
    (0, auth_api_docs_decorator_1.ApiAuthErrorModel)(),
    (0, common_1.Controller)(auth_constants_1.AUTH_CONTROLLER_BASE_PATH),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map