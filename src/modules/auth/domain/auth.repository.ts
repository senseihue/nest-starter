import { AuthUser } from './auth-user';

export interface AuthRepository {
  findByEmail(email: string): Promise<{ user: AuthUser; passwordHash: string } | null>;
}
