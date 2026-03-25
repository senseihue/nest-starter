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
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
const auth_constants_1 = require("../auth.constants");
const auth_service_1 = require("../application/auth.service");
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    constructor(authService) {
        super({
            passReqToCallback: true,
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_ACCESS_SECRET || 'dev_secret',
        });
        this.authService = authService;
    }
    async validate(request, payload) {
        const accessToken = passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken()(request);
        const tokenId = payload[auth_constants_1.AUTH_TOKEN_PAYLOAD_KEYS.TOKEN_ID];
        if (!accessToken || !tokenId) {
            throw new common_1.UnauthorizedException();
        }
        const isValid = await this.authService.validateAccessToken({
            tokenId,
            userId: payload[auth_constants_1.AUTH_TOKEN_PAYLOAD_KEYS.SUBJECT],
            accessToken,
        });
        if (!isValid) {
            throw new common_1.UnauthorizedException();
        }
        return {
            userId: payload[auth_constants_1.AUTH_TOKEN_PAYLOAD_KEYS.SUBJECT],
            email: payload.email,
            roles: payload.roles,
            permissions: payload.permissions,
            tokenId,
        };
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], JwtStrategy);
//# sourceMappingURL=jwt.strategy.js.map