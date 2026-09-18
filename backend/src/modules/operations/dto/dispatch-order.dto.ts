import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class DispatchOrderDto {
  @ApiProperty({
    description: 'Identifier of the finalized meal demand calculation',
    example: 901,
  })
  @IsNumber()
  mealDemandId: number;

  @ApiProperty({
    description: 'Name of the external catering provider',
    example: 'Công ty Suất ăn Công nghiệp Hà Nội SunFood',
  })
  @IsString()
  @IsNotEmpty()
  vendorName: string;

  @ApiProperty({
    description: 'Target arrival time at the school dock (ISO 8601 string)',
    example: '2026-10-12T10:30:00+07:00',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  targetDeliveryTime?: string;

  @ApiProperty({
    description: 'Special packaging or dietary notes for the vendor',
    example: '18 suất ăn riêng không hải sản đóng thùng dán nhãn màu vàng',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
