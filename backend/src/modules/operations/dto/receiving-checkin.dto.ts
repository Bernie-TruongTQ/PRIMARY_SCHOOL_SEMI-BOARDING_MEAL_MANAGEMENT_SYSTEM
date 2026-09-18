import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive, IsString, Min } from 'class-validator';

export class ReceivingCheckinDto {
  @ApiProperty({
    description: 'Identifier of the catering purchase order',
    example: 650,
  })
  @IsNumber()
  cateringOrderId: number;

  @ApiProperty({
    description: 'Vehicle license plate number',
    example: '29H-882.14',
  })
  @IsString()
  @IsNotEmpty()
  vehiclePlate: string;

  @ApiProperty({
    description: 'Full name of delivery driver',
    example: 'Vũ Văn Thắng',
  })
  @IsString()
  @IsNotEmpty()
  driverName: string;

  @ApiProperty({
    description: 'Total number of thermal insulated food containers delivered',
    example: 42,
  })
  @IsNumber()
  @IsPositive()
  thermalContainerCount: number;

  @ApiProperty({
    description: 'Total portions declared on delivery slip',
    example: 1260,
  })
  @IsNumber()
  @Min(1)
  deliveredPortions: number;
}
