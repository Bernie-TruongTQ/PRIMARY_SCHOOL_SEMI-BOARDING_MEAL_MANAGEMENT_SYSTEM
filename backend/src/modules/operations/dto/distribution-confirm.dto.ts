import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class DistributionConfirmDto {
  @ApiProperty({
    description: 'Identifier of the inspected meal delivery',
    example: 320,
  })
  @IsNumber()
  mealDeliveryId: number;

  @ApiProperty({
    description: 'Identifier of the recipient classroom',
    example: 12,
  })
  @IsNumber()
  classId: number;

  @ApiProperty({
    description: 'Standard portions allocated to this classroom trolley',
    example: 28,
  })
  @IsNumber()
  @Min(1)
  allocatedPortions: number;

  @ApiProperty({
    description: 'Special dietary/allergy portions allocated to this classroom',
    example: 1,
    default: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  specialDietaryPortions?: number = 0;

  @ApiProperty({
    description: 'User ID of teacher or staff acknowledging receipt',
    example: 204,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  receivedByTeacherId?: number;
}
