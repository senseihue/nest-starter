import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AUTH_REPOSITORY } from '@/modules/auth/auth.tokens';
import { AuthUser } from '@/modules/auth/domain/auth-user';
import { AuthRepository } from '@/modules/auth/domain/auth.repository';
import { InvalidCredentialsException } from '@/modules/auth/exceptions/invalid-credentials.exception';
import { resolvePermissions } from '@/modules/auth/role-permissions.map';
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

  async register(id: string, name: string, email: string, password: string) {
    return this.usersService.registerUser(id, name, email, password);
  }
}
