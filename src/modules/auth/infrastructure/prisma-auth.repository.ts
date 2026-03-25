import { Injectable } from '@nestjs/common';
import { AuthUser } from '@/modules/auth/domain/auth-user';
import { AuthRepository, StoredAuthToken } from '@/modules/auth/domain/auth.repository';
import { PrismaService } from '@/shared/prisma/prisma.service';

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

  async createAccessToken(data: {
    id: string;
    userId: string;
    tokenHash: string;
    expiresAt: Date;
  }): Promise<void> {
    await this.prisma.authToken.create({
      data,
    });
  }

  async findValidAccessToken(data: {
    id: string;
    userId: string;
    tokenHash: string;
    now: Date;
  }): Promise<StoredAuthToken | null> {
    return this.prisma.authToken.findFirst({
      where: {
        id: data.id,
        userId: data.userId,
        tokenHash: data.tokenHash,
        revokedAt: null,
        expiresAt: {
          gt: data.now,
        },
      },
    });
  }

  async revokeAccessToken(id: string, revokedAt: Date): Promise<void> {
    await this.prisma.authToken.update({
      where: { id },
      data: { revokedAt },
    });
  }
}
