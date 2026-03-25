import * as bcrypt from 'bcrypt';
import { UsersService } from '@/modules/users/application/users.service';
import { User } from '@/modules/users/domain/user.entity';
import { UserRepository } from '@/modules/users/domain/user.repository';

describe('UsersService', () => {
  let service: UsersService;
  let repository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    repository = {
      findById: jest.fn(),
      save: jest.fn(),
      createWithPassword: jest.fn(),
      findAll: jest.fn(),
      findPage: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    service = new UsersService(repository);
  });

  it('creates a user without password', async () => {
    const user = await service.createUser('user-id', 'John', 'john@example.com');

    expect(repository.save).toHaveBeenCalledWith(expect.any(User));
    expect(user.id).toBe('user-id');
    expect(user.getName()).toBe('John');
    expect(user.getEmail()).toBe('john@example.com');
  });

  it('registers a user with hashed password', async () => {
    const hashSpy = jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashed-password' as never);

    const user = await service.registerUser('user-id', 'John', 'john@example.com', 'secret');

    expect(hashSpy).toHaveBeenCalledWith('secret', 12);
    expect(repository.createWithPassword).toHaveBeenCalledWith(
      expect.any(User),
      'hashed-password',
      [],
    );
    expect(user.getEmail()).toBe('john@example.com');
  });

  it('returns paginated users', async () => {
    repository.findPage.mockResolvedValue({
      items: [new User('user-id', 'John', 'john@example.com')],
      total: 1,
    });

    const result = await service.listUsersPage(1, 20);

    expect(repository.findPage).toHaveBeenCalledWith(1, 20);
    expect(result.total).toBe(1);
    expect(result.items).toHaveLength(1);
  });
});
