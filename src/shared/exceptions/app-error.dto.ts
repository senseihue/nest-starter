import { ApiProperty } from '@nestjs/swagger';

export class AppErrorResponseDto {
  @ApiProperty({ example: 404 })
  statusCode!: number;

  @ApiProperty({ example: 'NotFoundException' })
  error!: string;

  @ApiProperty({ example: 'User not found' })
  message!: string;

  @ApiProperty({ example: 'USER_NOT_FOUND' })
  code!: string;

  @ApiProperty({ example: '/api/users/123' })
  path!: string;

  @ApiProperty({ example: '2026-03-17T10:20:00.000Z' })
  timestamp!: string;
}
