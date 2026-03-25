"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const http_exception_filter_1 = require("./shared/exceptions/http-exception.filter");
const response_wrapper_interceptor_1 = require("./shared/interceptors/response-wrapper.interceptor");
const log_interceptor_1 = require("./shared/logger/log.interceptor");
const prisma_service_1 = require("./shared/prisma/prisma.service");
async function listenWithPortFallback(app, host, preferredPort, hasExplicitPort) {
    let port = preferredPort;
    while (true) {
        try {
            await app.listen(port, host);
            return port;
        }
        catch (error) {
            const listenError = error;
            if (listenError.code !== 'EADDRINUSE' || hasExplicitPort) {
                throw error;
            }
            port += 1;
        }
    }
}
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.get(prisma_service_1.PrismaService);
    app.enableShutdownHooks();
    const hasExplicitPort = process.env.PORT !== undefined;
    const port = Number(process.env.PORT ?? 3000);
    const host = process.env.HOST ?? '127.0.0.1';
    app.setGlobalPrefix('api');
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    app.useGlobalInterceptors(new response_wrapper_interceptor_1.ResponseWrapperInterceptor(), app.get(log_interceptor_1.LogInterceptor));
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        transformOptions: { enableImplicitConversion: true },
        exceptionFactory: (errors) => {
            const messages = errors.flatMap((error) => {
                const constraints = error.constraints ? Object.values(error.constraints) : [];
                if (constraints.length > 0) {
                    return constraints;
                }
                if (error.children && error.children.length > 0) {
                    return error.children.flatMap((child) => child.constraints ? Object.values(child.constraints) : []);
                }
                return [];
            });
            return new common_1.BadRequestException({
                message: messages.length > 0 ? messages.join(', ') : 'Validation failed',
                code: 'VALIDATION_ERROR',
            });
        },
    }));
    const swaggerConfig = new swagger_1.DocumentBuilder()
        .setTitle('NestJS Starter API')
        .setDescription('Modular backend starter with Prisma and JWT')
        .setVersion('1.0.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
    swagger_1.SwaggerModule.setup('docs', app, document);
    await listenWithPortFallback(app, host, port, hasExplicitPort);
}
bootstrap();
//# sourceMappingURL=main.js.map