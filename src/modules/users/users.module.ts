import { Module } from '@nestjs/common';
import { UsersService } from '@/modules/users/application/users.service';
import { PrismaUserRepository } from '@/modules/users/infrastructure/prisma-user.repository';
import { UsersController } from '@/modules/users/interfaces/users.controller';
import { USER_REPOSITORY } from '@/modules/users/users.tokens';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: USER_REPOSITORY,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [UsersService],
})
export class UsersModule {}
