import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '@/modules/auth/application/auth.service';
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

    const result = await service.login(
      new AuthUser('user-id', 'john@example.com', ['admin']),
    );

    expect(jwtService.signAsync).toHaveBeenCalled();
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
});
