import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from '@/modules/auth/application/auth.service';
import { AUTH_REPOSITORY } from '@/modules/auth/auth.tokens';
import { PermissionsGuard } from '@/modules/auth/guards/permissions.guard';
import { RolesGuard } from '@/modules/auth/guards/roles.guard';
import { PrismaAuthRepository } from '@/modules/auth/infrastructure/prisma-auth.repository';
import { AuthController } from '@/modules/auth/interfaces/auth.controller';
import { JwtStrategy } from '@/modules/auth/strategies/jwt.strategy';
import { UsersModule } from '@/modules/users/users.module';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET || 'dev_secret',
      signOptions: { expiresIn: '15m' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    PermissionsGuard,
    RolesGuard,
    {
      provide: AUTH_REPOSITORY,
      useClass: PrismaAuthRepository,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
