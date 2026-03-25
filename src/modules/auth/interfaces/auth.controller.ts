import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from '@/modules/auth/application/auth.service';
import {
  AUTH_CONTROLLER_BASE_PATH,
  AUTH_CONTROLLER_TAG,
  AUTH_OPERATION_DESCRIPTIONS,
  AUTH_OPERATION_SUMMARIES,
  AUTH_RESPONSE_DESCRIPTIONS,
  AUTH_ROUTES,
} from '@/modules/auth/auth.constants';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { AUTH_LOG_EVENTS } from '@/modules/auth/auth-log-events';
import {
  ApiAuthErrorModel,
  ApiInvalidAccessTokenError,
  ApiInvalidCredentialsError,
} from '@/modules/auth/interfaces/auth-api-docs.decorator';
import { toAuthUserResponse } from '@/modules/auth/interfaces/auth.presenter';
import { AuthenticatedUser } from '@/modules/auth/interfaces/authenticated-user.decorator';
import { AuthSessionUser } from '@/modules/auth/interfaces/auth-session-user';
import { LoginDto } from '@/modules/auth/interfaces/login.dto';
import { RegisterUserDto } from '@/modules/auth/interfaces/register-user.dto';
import { Loggable } from '@/shared/logger/log.decorator';

@ApiTags(AUTH_CONTROLLER_TAG)
@ApiAuthErrorModel()
@Controller(AUTH_CONTROLLER_BASE_PATH)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post(AUTH_ROUTES.REGISTER)
  @Loggable(AUTH_LOG_EVENTS.REGISTER)
  @ApiOperation({
    summary: AUTH_OPERATION_SUMMARIES.REGISTER,
    description: AUTH_OPERATION_DESCRIPTIONS.REGISTER,
  })
  @ApiOkResponse({ description: AUTH_RESPONSE_DESCRIPTIONS.REGISTER })
  async register(@Body() dto: RegisterUserDto) {
    const user = await this.authService.register(dto.id, dto.name, dto.email, dto.password);
    return toAuthUserResponse(user);
  }

  @Post(AUTH_ROUTES.LOGIN)
  @Loggable(AUTH_LOG_EVENTS.LOGIN)
  @ApiOperation({
    summary: AUTH_OPERATION_SUMMARIES.LOGIN,
    description: AUTH_OPERATION_DESCRIPTIONS.LOGIN,
  })
  @ApiOkResponse({ description: AUTH_RESPONSE_DESCRIPTIONS.LOGIN })
  @ApiInvalidCredentialsError()
  async login(@Body() dto: LoginDto) {
    const user = await this.authService.validateUser(dto.email, dto.password);
    return this.authService.login(user);
  }

  @Post(AUTH_ROUTES.LOGOUT)
  @UseGuards(JwtAuthGuard)
  @Loggable(AUTH_LOG_EVENTS.LOGOUT)
  @ApiOperation({
    summary: AUTH_OPERATION_SUMMARIES.LOGOUT,
    description: AUTH_OPERATION_DESCRIPTIONS.LOGOUT,
  })
  @ApiOkResponse({ description: AUTH_RESPONSE_DESCRIPTIONS.LOGOUT })
  @ApiInvalidAccessTokenError()
  async logout(@AuthenticatedUser() user: AuthSessionUser) {
    return this.authService.logout(user);
  }
}
