import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { BPMN_NODE_TYPES } from '@/modules/bpmn/bpmn.constants';

class ExportBpmnNodePositionDto {
  @ApiProperty()
  @IsInt()
  @Min(0)
  x!: number;

  @ApiProperty()
  @IsInt()
  @Min(0)
  y!: number;
}

class ExportBpmnNodeDto {
  @ApiProperty()
  @IsString()
  id!: string;

  @ApiProperty()
  @IsString()
  name!: string;

  @ApiProperty({ enum: Object.values(BPMN_NODE_TYPES) })
  @IsEnum(BPMN_NODE_TYPES)
  type!: keyof typeof BPMN_NODE_TYPES extends never
    ? never
    : (typeof BPMN_NODE_TYPES)[keyof typeof BPMN_NODE_TYPES];

  @ApiPropertyOptional({
    example: { x: 220, y: 118 },
    description: 'Optional BPMN diagram coordinates for shape generation',
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => ExportBpmnNodePositionDto)
  position?: ExportBpmnNodePositionDto;
}

class ExportBpmnFlowDto {
  @ApiProperty()
  @IsString()
  id!: string;

  @ApiProperty()
  @IsString()
  sourceRef!: string;

  @ApiProperty()
  @IsString()
  targetRef!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;
}

export class ExportBpmnXmlDto {
  @ApiProperty()
  @IsString()
  processId!: string;

  @ApiProperty()
  @IsString()
  processName!: string;

  @ApiProperty({ type: [ExportBpmnNodeDto] })
  @IsArray()
  @ArrayMinSize(2)
  @ValidateNested({ each: true })
  @Type(() => ExportBpmnNodeDto)
  nodes!: ExportBpmnNodeDto[];

  @ApiProperty({ type: [ExportBpmnFlowDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ExportBpmnFlowDto)
  flows!: ExportBpmnFlowDto[];
}
