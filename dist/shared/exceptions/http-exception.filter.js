"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
let HttpExceptionFilter = class HttpExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = exception instanceof common_1.HttpException
            ? exception.getStatus()
            : common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        const errorName = exception instanceof common_1.HttpException
            ? exception.name
            : 'InternalServerError';
        const message = exception instanceof common_1.HttpException
            ? this.extractMessage(exception)
            : 'Unexpected error';
        const code = exception instanceof common_1.HttpException
            ? exception.getResponse().code ?? 'HTTP_EXCEPTION'
            : 'INTERNAL_ERROR';
        const body = {
            statusCode: status,
            error: errorName,
            message,
            code,
            path: request.url,
            timestamp: new Date().toISOString(),
        };
        response.status(status).json(body);
    }
    extractMessage(exception) {
        const response = exception.getResponse();
        if (typeof response === 'string') {
            return response;
        }
        if (typeof response === 'object' && response !== null) {
            const message = response.message;
            if (Array.isArray(message)) {
                return message.join(', ');
            }
            if (typeof message === 'string') {
                return message;
            }
        }
        return exception.message || 'Error';
    }
};
exports.HttpExceptionFilter = HttpExceptionFilter;
exports.HttpExceptionFilter = HttpExceptionFilter = __decorate([
    (0, common_1.Catch)()
], HttpExceptionFilter);
//# sourceMappingURL=http-exception.filter.js.map