import { Injectable } from '@nestjs/common';
import { User } from '@/modules/users/domain/user.entity';
import { UserRepository } from '@/modules/users/domain/user.repository';
import { PrismaService } from '@/shared/prisma/prisma.service';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    const record = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!record) {
      return null;
    }

    return new User(record.id, record.name, record.email);
  }

  async save(user: User): Promise<void> {
    await this.prisma.user.upsert({
      where: { id: user.id },
      create: {
        id: user.id,
        name: user.getName(),
        email: user.getEmail(),
        passwordHash: '',
        roles: [],
      },
      update: {
        name: user.getName(),
        email: user.getEmail(),
      },
    });
  }

  async createWithPassword(user: User, passwordHash: string, roles: string[] = []): Promise<void> {
    await this.prisma.user.create({
      data: {
        id: user.id,
        name: user.getName(),
        email: user.getEmail(),
        passwordHash,
        roles,
      },
    });
  }

  async findAll(): Promise<User[]> {
    const records = await this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return records.map((record) => new User(record.id, record.name, record.email));
  }

  async findPage(page: number, limit: number): Promise<{ items: User[]; total: number }> {
    const skip = (page - 1) * limit;
    const [records, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count(),
    ]);

    return {
      items: records.map((record) => new User(record.id, record.name, record.email)),
      total,
    };
  }

  async update(
    id: string,
    data: { name?: string; email?: string; roles?: string[] },
  ): Promise<User | null> {
    const record = await this.prisma.user.findUnique({ where: { id } });
    if (!record) {
      return null;
    }

    const updated = await this.prisma.user.update({
      where: { id },
      data: {
        name: data.name ?? record.name,
        email: data.email ?? record.email,
        roles: data.roles ?? record.roles,
      },
    });

    return new User(updated.id, updated.name, updated.email);
  }

  async remove(id: string): Promise<boolean> {
    const existing = await this.prisma.user.findUnique({ where: { id } });
    if (!existing) {
      return false;
    }

    await this.prisma.user.delete({ where: { id } });
    return true;
  }
}
