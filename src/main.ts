import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from '@/app.module';
import { HttpExceptionFilter } from '@/shared/exceptions/http-exception.filter';
import { ResponseWrapperInterceptor } from '@/shared/interceptors/response-wrapper.interceptor';
import { LogInterceptor } from '@/shared/logger/log.interceptor';
import { PrismaService } from '@/shared/prisma/prisma.service';

async function listenWithPortFallback(
  app: Awaited<ReturnType<typeof NestFactory.create>>,
  host: string,
  preferredPort: number,
  hasExplicitPort: boolean,
) {
  let port = preferredPort;

  while (true) {
    try {
      await app.listen(port, host);
      return port;
    } catch (error) {
      const listenError = error as NodeJS.ErrnoException;
      if (listenError.code !== 'EADDRINUSE' || hasExplicitPort) {
        throw error;
      }

      port += 1;
    }
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.get(PrismaService);
  app.enableShutdownHooks();
  const hasExplicitPort = process.env.PORT !== undefined;
  const port = Number(process.env.PORT ?? 3000);
  const host = process.env.HOST ?? '127.0.0.1';
  app.setGlobalPrefix('api');
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ResponseWrapperInterceptor(), app.get(LogInterceptor));
  app.useGlobalPipes(
    new ValidationPipe({
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
            return error.children.flatMap((child) =>
              child.constraints ? Object.values(child.constraints) : [],
            );
          }
          return [];
        });

        return new BadRequestException({
          message: messages.length > 0 ? messages.join(', ') : 'Validation failed',
          code: 'VALIDATION_ERROR',
        });
      },
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('NestJS Starter API')
    .setDescription('Modular backend starter with Prisma and JWT')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  await listenWithPortFallback(app, host, port, hasExplicitPort);
}

bootstrap();
