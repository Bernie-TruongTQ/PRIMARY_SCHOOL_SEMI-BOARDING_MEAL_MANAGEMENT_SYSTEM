import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';

export class CalculateDemandDto {
  @ApiProperty({
    description: 'Unique identifier of the meal schedule',
    example: 42,
  })
  @IsNumber()
  mealScheduleId: number;

  @ApiProperty({
    description: 'Safety buffer rate margin (between 0% and 10%)',
    example: 0.05,
    default: 0.05,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0.0)
  @Max(0.1)
  bufferRate?: number = 0.05;
}
