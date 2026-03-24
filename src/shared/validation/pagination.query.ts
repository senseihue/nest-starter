import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { VALIDATION_MESSAGES } from './messages';

export class PaginationQuery {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt({ message: VALIDATION_MESSAGES.page.isInt })
  @Min(1, { message: VALIDATION_MESSAGES.page.min })
  page?: number = 1;

  @ApiPropertyOptional({ example: 20 })
  @IsOptional()
  @IsInt({ message: VALIDATION_MESSAGES.limit.isInt })
  @Min(1, { message: VALIDATION_MESSAGES.limit.min })
  @Max(100, { message: VALIDATION_MESSAGES.limit.max })
  limit?: number = 20;

  @ApiPropertyOptional({ example: 'createdAt' })
  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.sort.isString })
  sort?: string = 'createdAt';

  @ApiPropertyOptional({ example: 'desc', enum: ['asc', 'desc'] })
  @IsOptional()
  @IsIn(['asc', 'desc'], { message: VALIDATION_MESSAGES.order.isIn })
  order?: 'asc' | 'desc' = 'desc';
}
