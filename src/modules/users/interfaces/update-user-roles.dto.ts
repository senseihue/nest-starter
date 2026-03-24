import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserRolesDto {
  @ApiProperty({ type: [String] })
  roles!: string[];
}
