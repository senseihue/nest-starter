import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InvalidCredentialsException } from '../exceptions/invalid-credentials.exception';
import { AuthUser } from '../domain/auth-user';
import { AuthRepository } from '../domain/auth.repository';
import { AUTH_REPOSITORY } from '../auth.tokens';
import { resolvePermissions } from '../role-permissions.map';

@Injectable()
export class AuthService {
  constructor(
    @Inject(AUTH_REPOSITORY) private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
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
    const payload = {
      sub: user.id,
      email: user.email,
      roles: user.roles,
      permissions,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}
