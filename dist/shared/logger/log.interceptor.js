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
exports.LogInterceptor = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const operators_1 = require("rxjs/operators");
const app_logger_service_1 = require("./app-logger.service");
const log_decorator_1 = require("./log.decorator");
let LogInterceptor = class LogInterceptor {
    constructor(reflector, logger) {
        this.reflector = reflector;
        this.logger = logger;
        this.requestLoggingEnabled = process.env.REQUEST_LOGGING_ENABLED !== 'false';
    }
    intercept(context, next) {
        const config = this.reflector.getAllAndOverride(log_decorator_1.LOGGABLE_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!config || !this.requestLoggingEnabled) {
            return next.handle();
        }
        const http = context.switchToHttp();
        const request = http.getRequest();
        const start = Date.now();
        return next.handle().pipe((0, operators_1.tap)(() => {
            const duration = Date.now() - start;
            const user = request.user;
            const forwardedFor = request.headers['x-forwarded-for'];
            const ip = Array.isArray(forwardedFor)
                ? forwardedFor[0]
                : forwardedFor?.split(',')[0]?.trim() || request.ip;
            const userAgent = request.headers['user-agent'];
            this.logger.info(config.message ?? 'Request handled', {
                method: request.method,
                path: request.url,
                durationMs: duration,
                userId: user?.userId,
                email: user?.email,
                ip,
                userAgent,
            });
        }));
    }
};
exports.LogInterceptor = LogInterceptor;
exports.LogInterceptor = LogInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        app_logger_service_1.AppLoggerService])
], LogInterceptor);
//# sourceMappingURL=log.interceptor.js.map