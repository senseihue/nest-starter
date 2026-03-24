import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Permissions } from '../../auth/guards/permissions.decorator';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { AuthenticatedUser } from '../../auth/interfaces/authenticated-user.decorator';
import { PERMISSIONS } from '../../auth/permissions';
import { UsersService } from '../application/users.service';
import { UserNotFoundException } from '../exceptions/user-not-found.exception';
import { AppErrorResponseDto } from '../../../shared/exceptions/app-error.dto';
import { buildPaginationMeta } from '../../../shared/interceptors/pagination-response';
import { Loggable } from '../../../shared/logger/log.decorator';
import { CreateUserDto } from './create-user.dto';
import { ListUsersQuery } from './list-users.query';
import { RegisterUserDto } from './register-user.dto';
import { UpdateUserDto } from './update-user.dto';
import { UpdateUserRolesDto } from './update-user-roles.dto';

@ApiTags('users')
@ApiBearerAuth()
@ApiExtraModels(AppErrorResponseDto)
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

  @Post('register')
  @ApiOperation({ summary: 'Register user', description: 'Creates user with password' })
  @ApiOkResponse({ description: 'Registered user' })
  async register(@Body() dto: RegisterUserDto) {
    const user = await this.usersService.registerUser(dto.id, dto.name, dto.email, dto.password);
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
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid JWT',
    schema: {
      allOf: [{ $ref: getSchemaPath(AppErrorResponseDto) }],
      example: {
        statusCode: 401,
        error: 'UnauthorizedException',
        message: 'Unauthorized',
        code: 'HTTP_EXCEPTION',
        path: '/api/users',
        timestamp: '2026-03-17T10:20:00.000Z',
      },
    },
  })
  @ApiForbiddenResponse({
    description: 'Missing permission: users:read',
    schema: {
      allOf: [{ $ref: getSchemaPath(AppErrorResponseDto) }],
      example: {
        statusCode: 403,
        error: 'ForbiddenException',
        message: 'Forbidden',
        code: 'HTTP_EXCEPTION',
        path: '/api/users',
        timestamp: '2026-03-17T10:20:00.000Z',
      },
    },
  })
  async list(@Query() query: ListUsersQuery) {
    const { items, total } = await this.usersService.listUsersPage(query.page, query.limit);

    return {
      items: items.map((user) => ({
        id: user.id,
        name: user.getName(),
        email: user.getEmail(),
      })),
      pagination: buildPaginationMeta(page, limit, total),
    };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get user by id', description: 'Requires JWT' })
  @ApiOkResponse({ description: 'User details' })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid JWT',
    schema: {
      allOf: [{ $ref: getSchemaPath(AppErrorResponseDto) }],
      example: {
        statusCode: 401,
        error: 'UnauthorizedException',
        message: 'Unauthorized',
        code: 'HTTP_EXCEPTION',
        path: '/api/users/123',
        timestamp: '2026-03-17T10:20:00.000Z',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    schema: {
      allOf: [{ $ref: getSchemaPath(AppErrorResponseDto) }],
      example: {
        statusCode: 404,
        error: 'NotFoundException',
        message: 'User not found',
        code: 'USER_NOT_FOUND',
        path: '/api/users/123',
        timestamp: '2026-03-17T10:20:00.000Z',
      },
    },
  })
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
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid JWT',
    schema: {
      allOf: [{ $ref: getSchemaPath(AppErrorResponseDto) }],
      example: {
        statusCode: 401,
        error: 'UnauthorizedException',
        message: 'Unauthorized',
        code: 'HTTP_EXCEPTION',
        path: '/api/users/123',
        timestamp: '2026-03-17T10:20:00.000Z',
      },
    },
  })
  @ApiForbiddenResponse({
    description: 'Missing permission: users:write',
    schema: {
      allOf: [{ $ref: getSchemaPath(AppErrorResponseDto) }],
      example: {
        statusCode: 403,
        error: 'ForbiddenException',
        message: 'Forbidden',
        code: 'HTTP_EXCEPTION',
        path: '/api/users/123',
        timestamp: '2026-03-17T10:20:00.000Z',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    schema: {
      allOf: [{ $ref: getSchemaPath(AppErrorResponseDto) }],
      example: {
        statusCode: 404,
        error: 'NotFoundException',
        message: 'User not found',
        code: 'USER_NOT_FOUND',
        path: '/api/users/123',
        timestamp: '2026-03-17T10:20:00.000Z',
      },
    },
  })
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
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid JWT',
    schema: {
      allOf: [{ $ref: getSchemaPath(AppErrorResponseDto) }],
      example: {
        statusCode: 401,
        error: 'UnauthorizedException',
        message: 'Unauthorized',
        code: 'HTTP_EXCEPTION',
        path: '/api/users/123/roles',
        timestamp: '2026-03-17T10:20:00.000Z',
      },
    },
  })
  @ApiForbiddenResponse({
    description: 'Missing permission: users:roles',
    schema: {
      allOf: [{ $ref: getSchemaPath(AppErrorResponseDto) }],
      example: {
        statusCode: 403,
        error: 'ForbiddenException',
        message: 'Forbidden',
        code: 'HTTP_EXCEPTION',
        path: '/api/users/123/roles',
        timestamp: '2026-03-17T10:20:00.000Z',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    schema: {
      allOf: [{ $ref: getSchemaPath(AppErrorResponseDto) }],
      example: {
        statusCode: 404,
        error: 'NotFoundException',
        message: 'User not found',
        code: 'USER_NOT_FOUND',
        path: '/api/users/123/roles',
        timestamp: '2026-03-17T10:20:00.000Z',
      },
    },
  })
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
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid JWT',
    schema: {
      allOf: [{ $ref: getSchemaPath(AppErrorResponseDto) }],
      example: {
        statusCode: 401,
        error: 'UnauthorizedException',
        message: 'Unauthorized',
        code: 'HTTP_EXCEPTION',
        path: '/api/users/123',
        timestamp: '2026-03-17T10:20:00.000Z',
      },
    },
  })
  @ApiForbiddenResponse({
    description: 'Missing permission: users:delete',
    schema: {
      allOf: [{ $ref: getSchemaPath(AppErrorResponseDto) }],
      example: {
        statusCode: 403,
        error: 'ForbiddenException',
        message: 'Forbidden',
        code: 'HTTP_EXCEPTION',
        path: '/api/users/123',
        timestamp: '2026-03-17T10:20:00.000Z',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    schema: {
      allOf: [{ $ref: getSchemaPath(AppErrorResponseDto) }],
      example: {
        statusCode: 404,
        error: 'NotFoundException',
        message: 'User not found',
        code: 'USER_NOT_FOUND',
        path: '/api/users/123',
        timestamp: '2026-03-17T10:20:00.000Z',
      },
    },
  })
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
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid JWT',
    schema: {
      allOf: [{ $ref: getSchemaPath(AppErrorResponseDto) }],
      example: {
        statusCode: 401,
        error: 'UnauthorizedException',
        message: 'Unauthorized',
        code: 'HTTP_EXCEPTION',
        path: '/api/users/me/profile',
        timestamp: '2026-03-17T10:20:00.000Z',
      },
    },
  })
  getProfile(
    @AuthenticatedUser()
    user: { userId: string; email: string; roles: string[]; permissions: string[] },
  ) {
    return user;
  }
}
