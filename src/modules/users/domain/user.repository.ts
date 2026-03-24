import { User } from './user.entity';

export interface UserRepository {
  findById(id: string): Promise<User | null>;
  save(user: User): Promise<void>;
  createWithPassword(user: User, passwordHash: string, roles?: string[]): Promise<void>;
  findAll(): Promise<User[]>;
  findPage(page: number, limit: number): Promise<{ items: User[]; total: number }>;
  update(id: string, data: { name?: string; email?: string; roles?: string[] }): Promise<User | null>;
  remove(id: string): Promise<boolean>;
}
