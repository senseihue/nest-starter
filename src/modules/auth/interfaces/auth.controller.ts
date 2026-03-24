import { Body, Controller, Post } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse, getSchemaPath } from '@nestjs/swagger';
import { AuthService } from '../application/auth.service';
import { LoginDto } from './login.dto';
import { AppErrorResponseDto } from '../../../shared/exceptions/app-error.dto';
import { Loggable } from '../../../shared/logger/log.decorator';

@ApiTags('auth')
@ApiExtraModels(AppErrorResponseDto)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Loggable('Auth login')
  @ApiOperation({ summary: 'Login', description: 'Returns JWT access token' })
  @ApiOkResponse({ description: 'JWT access token' })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials',
    schema: {
      allOf: [{ $ref: getSchemaPath(AppErrorResponseDto) }],
      example: {
        statusCode: 401,
        error: 'UnauthorizedException',
        message: 'Invalid credentials',
        code: 'INVALID_CREDENTIALS',
        path: '/api/auth/login',
        timestamp: '2026-03-17T10:20:00.000Z',
      },
    },
  })
  async login(@Body() dto: LoginDto) {
    const user = await this.authService.validateUser(dto.email, dto.password);
    return this.authService.login(user);
  }
}
