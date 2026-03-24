import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from '@/modules/auth/application/auth.service';
import { ApiAuthErrorModel, ApiInvalidCredentialsError } from '@/modules/auth/interfaces/auth-api-docs.decorator';
import { LoginDto } from '@/modules/auth/interfaces/login.dto';
import { RegisterUserDto } from '@/modules/auth/interfaces/register-user.dto';
import { Loggable } from '@/shared/logger/log.decorator';

@ApiTags('auth')
@ApiAuthErrorModel()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Loggable('Auth register')
  @ApiOperation({ summary: 'Register user', description: 'Creates user with password' })
  @ApiOkResponse({ description: 'Registered user' })
  async register(@Body() dto: RegisterUserDto) {
    const user = await this.authService.register(dto.id, dto.name, dto.email, dto.password);
    return {
      id: user.id,
      name: user.getName(),
      email: user.getEmail(),
    };
  }

  @Post('login')
  @Loggable('Auth login')
  @ApiOperation({ summary: 'Login', description: 'Returns JWT access token' })
  @ApiOkResponse({ description: 'JWT access token' })
  @ApiInvalidCredentialsError()
  async login(@Body() dto: LoginDto) {
    const user = await this.authService.validateUser(dto.email, dto.password);
    return this.authService.login(user);
  }
}
