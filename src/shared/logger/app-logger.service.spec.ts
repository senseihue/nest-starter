import { AppLoggerService } from '@/shared/logger/app-logger.service';

describe('AppLoggerService', () => {
  const flushImmediate = () => new Promise((resolve) => setImmediate(resolve));

  afterEach(() => {
    jest.restoreAllMocks();
    delete process.env.NODE_ENV;
    delete process.env.LOG_LEVEL;
  });

  it('writes readable logs outside production', async () => {
    process.env.NODE_ENV = 'development';
    const writeSpy = jest.spyOn(process.stdout, 'write').mockImplementation(() => true);
    const service = new AppLoggerService();

    service.info('Users list', {
      method: 'GET',
      path: '/api/users',
      durationMs: 12,
    });

    await flushImmediate();

    expect(writeSpy).toHaveBeenCalledWith(
      expect.stringContaining('INFO App Users list method=GET path=/api/users durationMs=12\n'),
    );
  });

  it('writes jsonl logs in production', async () => {
    process.env.NODE_ENV = 'production';
    const writeSpy = jest.spyOn(process.stdout, 'write').mockImplementation(() => true);
    const service = new AppLoggerService();

    service.info('Users list', {
      method: 'GET',
      path: '/api/users',
      durationMs: 12,
    });

    await flushImmediate();

    expect(writeSpy).toHaveBeenCalledWith(expect.stringContaining('"level":"info"'));
    expect(writeSpy).toHaveBeenCalledWith(expect.stringContaining('"message":"Users list"'));
    expect(writeSpy).toHaveBeenCalledWith(expect.stringContaining('"path":"/api/users"'));
  });

  it('skips info logs below configured level', async () => {
    process.env.LOG_LEVEL = 'warn';
    const writeSpy = jest.spyOn(process.stdout, 'write').mockImplementation(() => true);
    const service = new AppLoggerService();

    service.info('Users list', { path: '/api/users' });

    await flushImmediate();

    expect(writeSpy).not.toHaveBeenCalled();
  });

  it('keeps error logs when log level is warn', async () => {
    process.env.LOG_LEVEL = 'warn';
    const writeSpy = jest.spyOn(process.stderr, 'write').mockImplementation(() => true);
    const service = new AppLoggerService();

    service.error('Request failed', { path: '/api/users' });

    await flushImmediate();

    expect(writeSpy).toHaveBeenCalledWith(expect.stringContaining('ERROR App Request failed'));
  });
});
