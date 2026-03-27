import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ImportBpmnXmlDto {
  @ApiProperty()
  @IsString()
  xml!: string;
}
