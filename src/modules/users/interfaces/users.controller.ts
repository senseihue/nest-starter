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
import { PERMISSIONS } from '@/modules/auth/permissions';
import { UsersService } from '@/modules/users/application/users.service';
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
import { UpdateUserDto } from '@/modules/users/interfaces/update-user.dto';
import { UpdateUserRolesDto } from '@/modules/users/interfaces/update-user-roles.dto';
import { buildPaginationMeta } from '@/shared/interceptors/pagination-response';
import { Loggable } from '@/shared/logger/log.decorator';

@ApiTags('users')
@ApiBearerAuth()
@ApiUsersErrorModel()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create user (no password)', description: 'No auth required' })
  @ApiOkResponse({ description: 'Created user' })
  async create(@Body() dto: CreateUserDto) {
    const user = await this.usersService.createUser(dto.id, dto.name, dto.email);
    return {
      id: user.id,
      name: user.getName(),
      email: user.getEmail(),
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.USERS_READ)
  @Loggable('Users list')
  @ApiOperation({ summary: 'List users', description: 'Requires permission: users:read' })
  @ApiOkResponse({ description: 'List of users' })
  @ApiUsersUnauthorized('/api/users')
  @ApiUsersReadPermissionDenied()
  async list(@Query() query: ListUsersQuery) {
    const { items, total } = await this.usersService.listUsersPage(query.page, query.limit);

    return {
      items: items.map((user) => ({
        id: user.id,
        name: user.getName(),
        email: user.getEmail(),
      })),
      pagination: buildPaginationMeta(query.page, query.limit, total),
    };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get user by id', description: 'Requires JWT' })
  @ApiOkResponse({ description: 'User details' })
  @ApiUsersUnauthorized('/api/users/123')
  @ApiUserNotFound('/api/users/123')
  async getById(@Param('id') id: string) {
    const user = await this.usersService.getUser(id);
    if (!user) {
      throw new UserNotFoundException();
    }

    return {
      id: user.id,
      name: user.getName(),
      email: user.getEmail(),
    };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.USERS_WRITE)
  @ApiOperation({ summary: 'Update user', description: 'Requires permission: users:write' })
  @ApiOkResponse({ description: 'Updated user' })
  @ApiUsersUnauthorized('/api/users/123')
  @ApiUsersWritePermissionDenied()
  @ApiUserNotFound('/api/users/123')
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    const updated = await this.usersService.updateUser(id, dto);
    if (!updated) {
      throw new UserNotFoundException();
    }

    return {
      id: updated.id,
      name: updated.getName(),
      email: updated.getEmail(),
    };
  }

  @Patch(':id/roles')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.USERS_ROLES)
  @ApiOperation({ summary: 'Update user roles', description: 'Requires permission: users:roles' })
  @ApiOkResponse({ description: 'Updated user roles' })
  @ApiUsersUnauthorized('/api/users/123/roles')
  @ApiUsersRolesPermissionDenied()
  @ApiUserNotFound('/api/users/123/roles')
  async updateRoles(@Param('id') id: string, @Body() dto: UpdateUserRolesDto) {
    const updated = await this.usersService.updateUserRoles(id, dto.roles);
    if (!updated) {
      throw new UserNotFoundException();
    }

    return {
      id: updated.id,
      name: updated.getName(),
      email: updated.getEmail(),
      roles: dto.roles,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(PERMISSIONS.USERS_DELETE)
  @ApiOperation({ summary: 'Remove user', description: 'Requires permission: users:delete' })
  @ApiOkResponse({ description: 'User removed' })
  @ApiUsersUnauthorized('/api/users/123')
  @ApiUsersDeletePermissionDenied()
  @ApiUserNotFound('/api/users/123')
  async remove(@Param('id') id: string) {
    const removed = await this.usersService.removeUser(id);
    if (!removed) {
      throw new UserNotFoundException();
    }

    return { success: true };
  }

  @Get('me/profile')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get current user profile', description: 'Requires JWT' })
  @ApiOkResponse({ description: 'Current user profile' })
  @ApiUsersUnauthorized('/api/users/me/profile')
  getProfile(
    @AuthenticatedUser()
    user: { userId: string; email: string; roles: string[]; permissions: string[] },
  ) {
    return user;
  }
}
