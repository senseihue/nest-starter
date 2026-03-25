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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const crypto_1 = require("crypto");
const auth_constants_1 = require("../auth.constants");
const auth_tokens_1 = require("../auth.tokens");
const invalid_credentials_exception_1 = require("../exceptions/invalid-credentials.exception");
const role_permissions_map_1 = require("../role-permissions.map");
const token_hash_1 = require("../utils/token-hash");
const users_service_1 = require("../../users/application/users.service");
let AuthService = class AuthService {
    constructor(authRepository, jwtService, usersService) {
        this.authRepository = authRepository;
        this.jwtService = jwtService;
        this.usersService = usersService;
    }
    async validateUser(email, password) {
        const record = await this.authRepository.findByEmail(email);
        if (!record) {
            throw new invalid_credentials_exception_1.InvalidCredentialsException();
        }
        const isValid = await bcrypt.compare(password, record.passwordHash);
        if (!isValid) {
            throw new invalid_credentials_exception_1.InvalidCredentialsException();
        }
        return record.user;
    }
    async login(user) {
        const permissions = (0, role_permissions_map_1.resolvePermissions)(user.roles);
        const tokenId = (0, crypto_1.randomUUID)();
        const payload = {
            [auth_constants_1.AUTH_TOKEN_PAYLOAD_KEYS.SUBJECT]: user.id,
            [auth_constants_1.AUTH_TOKEN_PAYLOAD_KEYS.TOKEN_ID]: tokenId,
            email: user.email,
            roles: user.roles,
            permissions,
        };
        const accessToken = await this.jwtService.signAsync(payload);
        const decodedToken = this.jwtService.decode(accessToken);
        const expiresAt = new Date((decodedToken?.exp ?? 0) * 1000);
        await this.authRepository.createAccessToken({
            id: tokenId,
            userId: user.id,
            tokenHash: (0, token_hash_1.createTokenHash)(accessToken),
            expiresAt,
        });
        return {
            accessToken,
        };
    }
    async register(id, name, email, password) {
        return this.usersService.registerUser(id, name, email, password);
    }
    async validateAccessToken(data) {
        const token = await this.authRepository.findValidAccessToken({
            id: data.tokenId,
            userId: data.userId,
            tokenHash: (0, token_hash_1.createTokenHash)(data.accessToken),
            now: new Date(),
        });
        return token !== null;
    }
    async logout(user) {
        await this.authRepository.revokeAccessToken(user.tokenId, new Date());
        return auth_constants_1.AUTH_SUCCESS_RESPONSES.LOGOUT;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(auth_tokens_1.AUTH_REPOSITORY)),
    __metadata("design:paramtypes", [Object, jwt_1.JwtService,
        users_service_1.UsersService])
], AuthService);
//# sourceMappingURL=auth.service.js.map