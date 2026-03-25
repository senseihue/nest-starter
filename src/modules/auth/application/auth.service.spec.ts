import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '@/modules/auth/application/auth.service';
import { AUTH_SUCCESS_RESPONSES } from '@/modules/auth/auth.constants';
import { AuthUser } from '@/modules/auth/domain/auth-user';
import { AuthRepository } from '@/modules/auth/domain/auth.repository';
import { InvalidCredentialsException } from '@/modules/auth/exceptions/invalid-credentials.exception';
import { UsersService } from '@/modules/users/application/users.service';

describe('AuthService', () => {
  let service: AuthService;
  let repository: jest.Mocked<AuthRepository>;
  let jwtService: jest.Mocked<JwtService>;
  let usersService: jest.Mocked<UsersService>;

  beforeEach(() => {
    repository = {
      findByEmail: jest.fn(),
      createAccessToken: jest.fn(),
      findValidAccessToken: jest.fn(),
      revokeAccessToken: jest.fn(),
    };

    jwtService = {
      signAsync: jest.fn(),
    } as unknown as jest.Mocked<JwtService>;

    usersService = {
      registerUser: jest.fn(),
    } as unknown as jest.Mocked<UsersService>;

    service = new AuthService(repository, jwtService, usersService);
  });

  it('validates user credentials', async () => {
    const user = new AuthUser('user-id', 'john@example.com', ['admin']);
    repository.findByEmail.mockResolvedValue({
      user,
      passwordHash: 'hashed-password',
    });
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

    const result = await service.validateUser('john@example.com', 'secret');

    expect(result).toBe(user);
  });

  it('throws on invalid credentials', async () => {
    repository.findByEmail.mockResolvedValue(null);

    await expect(service.validateUser('john@example.com', 'secret')).rejects.toBeInstanceOf(
      InvalidCredentialsException,
    );
  });

  it('returns access token on login', async () => {
    jwtService.signAsync.mockResolvedValue('jwt-token');
    jwtService.decode = jest.fn().mockReturnValue({ exp: 9999999999 }) as never;

    const result = await service.login(
      new AuthUser('user-id', 'john@example.com', ['admin']),
    );

    expect(jwtService.signAsync).toHaveBeenCalled();
    expect(repository.createAccessToken).toHaveBeenCalled();
    expect(result).toEqual({ accessToken: 'jwt-token' });
  });

  it('delegates registration to users service', async () => {
    const registeredUser = {
      id: 'user-id',
      getName: () => 'John',
      getEmail: () => 'john@example.com',
    };
    usersService.registerUser.mockResolvedValue(registeredUser as never);

    const result = await service.register('user-id', 'John', 'john@example.com', 'secret');

    expect(usersService.registerUser).toHaveBeenCalledWith(
      'user-id',
      'John',
      'john@example.com',
      'secret',
    );
    expect(result).toBe(registeredUser);
  });

  it('validates access token against repository', async () => {
    repository.findValidAccessToken.mockResolvedValue({
      id: 'token-id',
      userId: 'user-id',
      expiresAt: new Date(),
      revokedAt: null,
    });

    const result = await service.validateAccessToken({
      tokenId: 'token-id',
      userId: 'user-id',
      accessToken: 'jwt-token',
    });

    expect(result).toBe(true);
  });

  it('revokes token on logout', async () => {
    const result = await service.logout({
      userId: 'user-id',
      email: 'john@example.com',
      roles: ['admin'],
      permissions: [],
      tokenId: 'token-id',
    });

    expect(repository.revokeAccessToken).toHaveBeenCalledWith('token-id', expect.any(Date));
    expect(result).toEqual(AUTH_SUCCESS_RESPONSES.LOGOUT);
  });
});
