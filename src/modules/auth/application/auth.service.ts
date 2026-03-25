import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { AUTH_DEFAULTS, AUTH_SUCCESS_RESPONSES, AUTH_TOKEN_PAYLOAD_KEYS } from '@/modules/auth/auth.constants';
import { AUTH_REPOSITORY } from '@/modules/auth/auth.tokens';
import { AuthUser } from '@/modules/auth/domain/auth-user';
import { AuthRepository } from '@/modules/auth/domain/auth.repository';
import { InvalidCredentialsException } from '@/modules/auth/exceptions/invalid-credentials.exception';
import { resolvePermissions } from '@/modules/auth/role-permissions.map';
import { AuthSessionUser } from '@/modules/auth/interfaces/auth-session-user';
import { createTokenHash } from '@/modules/auth/utils/token-hash';
import { UsersService } from '@/modules/users/application/users.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(AUTH_REPOSITORY) private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async validateUser(email: string, password: string): Promise<AuthUser> {
    const record = await this.authRepository.findByEmail(email);
    if (!record) {
      throw new InvalidCredentialsException();
    }

    const isValid = await bcrypt.compare(password, record.passwordHash);
    if (!isValid) {
      throw new InvalidCredentialsException();
    }

    return record.user;
  }

  async login(user: AuthUser) {
    const permissions = resolvePermissions(user.roles);
    const tokenId = randomUUID();
    const payload = {
      [AUTH_TOKEN_PAYLOAD_KEYS.SUBJECT]: user.id,
      [AUTH_TOKEN_PAYLOAD_KEYS.TOKEN_ID]: tokenId,
      email: user.email,
      roles: user.roles,
      permissions,
    };
    const accessToken = await this.jwtService.signAsync(payload);
    const decodedToken = this.jwtService.decode(accessToken) as { exp?: number } | null;
    const expiresAt = new Date((decodedToken?.exp ?? 0) * 1000);

    await this.authRepository.createAccessToken({
      id: tokenId,
      userId: user.id,
      tokenHash: createTokenHash(accessToken),
      expiresAt,
    });

    return {
      accessToken,
    };
  }

  async register(id: string, name: string, email: string, password: string) {
    return this.usersService.registerUser(id, name, email, password);
  }

  async validateAccessToken(data: {
    tokenId: string;
    userId: string;
    accessToken: string;
  }) {
    const token = await this.authRepository.findValidAccessToken({
      id: data.tokenId,
      userId: data.userId,
      tokenHash: createTokenHash(data.accessToken),
      now: new Date(),
    });

    return token !== null;
  }

  async logout(user: AuthSessionUser) {
    await this.authRepository.revokeAccessToken(user.tokenId, new Date());
    return AUTH_SUCCESS_RESPONSES.LOGOUT;
  }
}
