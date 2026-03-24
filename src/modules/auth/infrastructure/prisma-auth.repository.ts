import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { AuthRepository } from '../domain/auth.repository';
import { AuthUser } from '../domain/auth-user';

@Injectable()
export class PrismaAuthRepository implements AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<{ user: AuthUser; passwordHash: string } | null> {
    const record = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!record) {
      return null;
    }

    return {
      user: new AuthUser(record.id, record.email, record.roles),
      passwordHash: record.passwordHash,
    };
  }
}
