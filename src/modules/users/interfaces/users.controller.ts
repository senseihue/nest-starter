import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { Permissions } from '@/modules/auth/guards/permissions.decorator';
import { PermissionsGuard } from '@/modules/auth/guards/permissions.guard';
import { AuthenticatedUser } from '@/modules/auth/interfaces/authenticated-user.decorator';
import { AuthSessionUser } from '@/modules/auth/interfaces/auth-session-user';
import { PERMISSIONS } from '@/modules/auth/permissions';
import { UsersService } from '@/modules/users/application/users.service';
import {
  USERS_CONTROLLER_BASE_PATH,
  USERS_CONTROLLER_TAG,
  USERS_DEFAULTS,
  USERS_OPERATION_DESCRIPTIONS,
  USERS_OPERATION_SUMMARIES,
  USERS_RESPONSE_DESCRIPTIONS,
  USERS_ROUTES,
} from '@/modules/users/users.constants';
import { UserNotFoundException } from '@/modules/users/exceptions/user-not-found.exception';
import {
  ApiUserNotFound,
  ApiUsersDeletePermissionDenied,
  ApiUsersErrorModel,
  ApiUsersReadPermissionDenied,
  ApiUsersRolesPermissionDenied,
  ApiUsersUnauthorized,
  ApiUsersWritePermissionDenied,
} from '@/modules/users/interfaces/users-api-docs.decorator';
import { CreateUserDto } from '@/modules/users/interfaces/create-user.dto';
import { ListUsersQuery } from '@/modules/users/interfaces/list-users.query';
import {
  toRemoveUserResponse,
  toUserResponse,
  toUserRolesResponse,
  toUsersPageResponse,
} from '@/modules/users/interfaces/users.presenter';
import { UpdateUserDto } from '@/modules/users/interfaces/update-user.dto';
import { UpdateUserRolesDto } from '@/modules/users/interfaces/update-user-roles.dto';
import { USERS_LOG_EVENTS } from '@/modules/users/users-log-events';
import { Loggable } from '@/shared/logger/log.decorator';

@ApiTags(USERS_CONTROLLER_TAG)
@ApiBearerAuth()
@ApiUsersErrorModel()
@Controller(USERS_CONTROLLER_BASE_PATH)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({
    summary: USERS_OPERATION_SUMMARIES.CREATE,
    description: USERS_OPERATION_DESCRIPTIONS.CREATE,
  })
  @ApiOkResponse({ description: USERS_RESPONSE_DESCRIPTIONS.CREATE })
  async create(@Body() dto: CreateUserDto) {
    const user = await this.usersService.createUser(dto.id, dto.name, dto.email);
    return toUserResponse(user);
  }

  @Get()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.USERS_READ)
  @Loggable(USERS_LOG_EVENTS.LIST)
  @ApiOperation({
    summary: USERS_OPERATION_SUMMARIES.LIST,
    description: USERS_OPERATION_DESCRIPTIONS.LIST,
  })
  @ApiOkResponse({ description: USERS_RESPONSE_DESCRIPTIONS.LIST })
  @ApiUsersUnauthorized('/api/users')
  @ApiUsersReadPermissionDenied()
  async list(@Query() query: ListUsersQuery) {
    const page = query.page ?? USERS_DEFAULTS.PAGE;
    const limit = query.limit ?? USERS_DEFAULTS.LIMIT;
    const { items, total } = await this.usersService.listUsersPage(page, limit);

    return toUsersPageResponse(items, page, limit, total);
  }

  @Get(USERS_ROUTES.DETAIL)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: USERS_OPERATION_SUMMARIES.GET_BY_ID,
    description: USERS_OPERATION_DESCRIPTIONS.GET_BY_ID,
  })
  @ApiOkResponse({ description: USERS_RESPONSE_DESCRIPTIONS.GET_BY_ID })
  @ApiUsersUnauthorized('/api/users/123')
  @ApiUserNotFound('/api/users/123')
  async getById(@Param('id') id: string) {
    const user = await this.usersService.getUser(id);
    if (!user) {
      throw new UserNotFoundException();
    }

    return toUserResponse(user);
  }

  @Patch(USERS_ROUTES.DETAIL)
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.USERS_WRITE)
  @ApiOperation({
    summary: USERS_OPERATION_SUMMARIES.UPDATE,
    description: USERS_OPERATION_DESCRIPTIONS.UPDATE,
  })
  @ApiOkResponse({ description: USERS_RESPONSE_DESCRIPTIONS.UPDATE })
  @ApiUsersUnauthorized('/api/users/123')
  @ApiUsersWritePermissionDenied()
  @ApiUserNotFound('/api/users/123')
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    const updated = await this.usersService.updateUser(id, dto);
    if (!updated) {
      throw new UserNotFoundException();
    }

    return toUserResponse(updated);
  }

  @Patch(USERS_ROUTES.ROLES)
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.USERS_ROLES)
  @ApiOperation({
    summary: USERS_OPERATION_SUMMARIES.UPDATE_ROLES,
    description: USERS_OPERATION_DESCRIPTIONS.UPDATE_ROLES,
  })
  @ApiOkResponse({ description: USERS_RESPONSE_DESCRIPTIONS.UPDATE_ROLES })
  @ApiUsersUnauthorized('/api/users/123/roles')
  @ApiUsersRolesPermissionDenied()
  @ApiUserNotFound('/api/users/123/roles')
  async updateRoles(@Param('id') id: string, @Body() dto: UpdateUserRolesDto) {
    const updated = await this.usersService.updateUserRoles(id, dto.roles);
    if (!updated) {
      throw new UserNotFoundException();
    }

    return toUserRolesResponse(updated, dto.roles);
  }

  @Delete(USERS_ROUTES.DETAIL)
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.USERS_DELETE)
  @ApiOperation({
    summary: USERS_OPERATION_SUMMARIES.REMOVE,
    description: USERS_OPERATION_DESCRIPTIONS.REMOVE,
  })
  @ApiOkResponse({ description: USERS_RESPONSE_DESCRIPTIONS.REMOVE })
  @ApiUsersUnauthorized('/api/users/123')
  @ApiUsersDeletePermissionDenied()
  @ApiUserNotFound('/api/users/123')
  async remove(@Param('id') id: string) {
    const removed = await this.usersService.removeUser(id);
    if (!removed) {
      throw new UserNotFoundException();
    }

    return toRemoveUserResponse();
  }

  @Get(USERS_ROUTES.PROFILE)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: USERS_OPERATION_SUMMARIES.GET_PROFILE,
    description: USERS_OPERATION_DESCRIPTIONS.GET_PROFILE,
  })
  @ApiOkResponse({ description: USERS_RESPONSE_DESCRIPTIONS.GET_PROFILE })
  @ApiUsersUnauthorized('/api/users/me/profile')
  getProfile(
    @AuthenticatedUser()
    user: AuthSessionUser,
  ) {
    return user;
  }
}
