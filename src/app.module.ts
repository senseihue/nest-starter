import { Module } from '@nestjs/common';
import { AuthModule } from '@/modules/auth/auth.module';
import { HealthModule } from '@/modules/health/health.module';
import { UsersModule } from '@/modules/users/users.module';
import { LoggerModule } from '@/shared/logger/logger.module';
import { PrismaModule } from '@/shared/prisma/prisma.module';

@Module({
  imports: [PrismaModule, LoggerModule, AuthModule, HealthModule, UsersModule],
})
export class AppModule {}
