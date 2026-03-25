import { AuthUser } from '@/modules/auth/domain/auth-user';

export interface StoredAuthToken {
  id: string;
  userId: string;
  expiresAt: Date;
  revokedAt: Date | null;
}

export interface AuthRepository {
  findByEmail(email: string): Promise<{ user: AuthUser; passwordHash: string } | null>;
  createAccessToken(data: {
    id: string;
    userId: string;
    tokenHash: string;
    expiresAt: Date;
  }): Promise<void>;
  findValidAccessToken(data: {
    id: string;
    userId: string;
    tokenHash: string;
    now: Date;
  }): Promise<StoredAuthToken | null>;
  revokeAccessToken(id: string, revokedAt: Date): Promise<void>;
}
