import { Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { USERS_DEFAULTS, USERS_EMPTY_ROLES } from '@/modules/users/users.constants';
import { User } from '@/modules/users/domain/user.entity';
import { UserRepository } from '@/modules/users/domain/user.repository';
import { USER_REPOSITORY } from '@/modules/users/users.tokens';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
  ) {}

  async createUser(id: string, name: string, email: string): Promise<User> {
    const user = new User(id, name, email);
    await this.userRepository.save(user);
    return user;
  }

  async registerUser(
    id: string,
    name: string,
    email: string,
    password: string,
    roles: string[] = USERS_EMPTY_ROLES,
  ): Promise<User> {
    const user = new User(id, name, email);
    const passwordHash = await bcrypt.hash(password, USERS_DEFAULTS.PASSWORD_HASH_ROUNDS);
    await this.userRepository.createWithPassword(user, passwordHash, roles);
    return user;
  }

  async getUser(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async listUsers(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async listUsersPage(page: number, limit: number): Promise<{ items: User[]; total: number }> {
    return this.userRepository.findPage(page, limit);
  }

  async updateUser(
    id: string,
    data: { name?: string; email?: string; roles?: string[] },
  ): Promise<User | null> {
    return this.userRepository.update(id, data);
  }

  async updateUserRoles(id: string, roles: string[]): Promise<User | null> {
    return this.userRepository.update(id, { roles });
  }

  async removeUser(id: string): Promise<boolean> {
    return this.userRepository.remove(id);
  }
}
