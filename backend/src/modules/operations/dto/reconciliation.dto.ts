import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CalculateReconciliationDto {
  @ApiProperty({
    description: 'Identifier of the catering order being reconciled',
    example: 650,
  })
  @IsNumber()
  cateringOrderId: number;

  @ApiProperty({
    description: 'Service date (YYYY-MM-DD)',
    example: '2026-10-12',
  })
  @IsDateString()
  mealDate: string;

  @ApiProperty({
    description: 'Total actual consumed meals recorded from classrooms',
    example: 1258,
  })
  @IsNumber()
  @Min(0)
  actualConsumedCount: number;

  @ApiProperty({
    description: 'Mandatory discrepancy justification if variance is detected',
    example: '2 học sinh lớp 2A về sớm lúc 11:15 do sốt',
    required: false,
  })
  @IsOptional()
  @IsString()
  discrepancyReason?: string;
}
