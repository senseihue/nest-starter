"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppLoggerService = void 0;
const common_1 = require("@nestjs/common");
const LOG_LEVEL_PRIORITY = {
    info: 20,
    warn: 30,
    error: 40,
};
let AppLoggerService = class AppLoggerService {
    constructor() {
        this.nodeEnv = process.env.NODE_ENV ?? 'development';
        this.logLevel = this.parseLogLevel(process.env.LOG_LEVEL);
    }
    info(message, meta) {
        this.write('info', message, meta);
    }
    warn(message, meta) {
        this.write('warn', message, meta);
    }
    error(message, meta) {
        this.write('error', message, meta);
    }
    write(level, message, meta) {
        if (!this.shouldLog(level)) {
            return;
        }
        setImmediate(() => {
            if (this.nodeEnv === 'production') {
                this.writeJsonl(level, message, meta);
                return;
            }
            this.writePretty(level, message, meta);
        });
    }
    writePretty(level, message, meta) {
        const text = meta && Object.keys(meta).length > 0
            ? `${message} ${this.formatPrettyMeta(meta)}`
            : message;
        const line = `[${new Date().toISOString()}] ${level.toUpperCase()} App ${text}`;
        this.emit(level, line);
    }
    writeJsonl(level, message, meta) {
        const payload = {
            level,
            message,
            timestamp: new Date().toISOString(),
            context: 'App',
            ...(meta ?? {}),
        };
        this.emit(level, JSON.stringify(payload));
    }
    emit(level, message) {
        const stream = level === 'error' ? process.stderr : process.stdout;
        stream.write(`${message}\n`);
    }
    shouldLog(level) {
        return LOG_LEVEL_PRIORITY[level] >= LOG_LEVEL_PRIORITY[this.logLevel];
    }
    parseLogLevel(value) {
        if (value === 'warn' || value === 'error' || value === 'info') {
            return value;
        }
        return 'info';
    }
    formatPrettyMeta(meta) {
        return Object.entries(meta)
            .filter(([, value]) => value !== undefined)
            .map(([key, value]) => `${key}=${this.stringifyValue(value)}`)
            .join(' ');
    }
    stringifyValue(value) {
        if (typeof value === 'string') {
            return value.includes(' ') ? `"${value}"` : value;
        }
        return JSON.stringify(value);
    }
};
exports.AppLoggerService = AppLoggerService;
exports.AppLoggerService = AppLoggerService = __decorate([
    (0, common_1.Injectable)()
], AppLoggerService);
//# sourceMappingURL=app-logger.service.js.map