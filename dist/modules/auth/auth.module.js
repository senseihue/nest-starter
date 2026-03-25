"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const auth_service_1 = require("./application/auth.service");
const auth_constants_1 = require("./auth.constants");
const auth_tokens_1 = require("./auth.tokens");
const permissions_guard_1 = require("./guards/permissions.guard");
const roles_guard_1 = require("./guards/roles.guard");
const prisma_auth_repository_1 = require("./infrastructure/prisma-auth.repository");
const auth_controller_1 = require("./interfaces/auth.controller");
const jwt_strategy_1 = require("./strategies/jwt.strategy");
const users_module_1 = require("../users/users.module");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            users_module_1.UsersModule,
            jwt_1.JwtModule.register({
                secret: process.env.JWT_ACCESS_SECRET || 'dev_secret',
                signOptions: { expiresIn: auth_constants_1.AUTH_DEFAULTS.ACCESS_TOKEN_EXPIRES_IN },
            }),
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [
            auth_service_1.AuthService,
            jwt_strategy_1.JwtStrategy,
            permissions_guard_1.PermissionsGuard,
            roles_guard_1.RolesGuard,
            {
                provide: auth_tokens_1.AUTH_REPOSITORY,
                useClass: prisma_auth_repository_1.PrismaAuthRepository,
            },
        ],
        exports: [auth_service_1.AuthService],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map