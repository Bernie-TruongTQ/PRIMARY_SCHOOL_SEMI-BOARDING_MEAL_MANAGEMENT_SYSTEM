import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';

export class ReceivingInspectDto {
  @ApiProperty({
    description: 'Identifier of the vehicle delivery check-in record',
    example: 320,
  })
  @IsNumber()
  mealDeliveryId: number;

  @ApiProperty({
    description: 'Core food temperature in degrees Celsius (Statutory threshold >= 65.0°C)',
    example: 72.5,
  })
  @IsNumber()
  coreTemperature: number;

  @ApiProperty({
    description: 'Whether tamper-evident lead seals on thermal boxes are fully intact',
    example: true,
  })
  @IsBoolean()
  containerSealsIntact: boolean;

  @ApiProperty({
    description: 'Whether sensory evaluation (appearance, smell, taste, color) passes quality check',
    example: true,
  })
  @IsBoolean()
  sensoryEvalPass: boolean;

  @ApiProperty({
    description: 'Whether statutory 24-hour food retention sample has been sealed in sterile container',
    example: true,
  })
  @IsBoolean()
  retentionSampleTaken: boolean;

  @ApiProperty({
    description: 'Photo URL of the calibrated digital thermometer display during test',
    example: 'https://storage.schoolmeals.edu.vn/inspections/20261012-temp-725.jpg',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  thermometerPhotoUrl?: string;

  @ApiProperty({
    description: 'Photo URL of the sealed 24h sample jar in retention refrigerator',
    example: 'https://storage.schoolmeals.edu.vn/inspections/20261012-sample-jar.jpg',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  samplePhotoUrl?: string;

  @ApiProperty({
    description: 'Inspector remarks or notes',
    example: 'Nhiệt độ đạt chuẩn, niêm chì nguyên vẹn, mẫu lưu niêm phong tủ lạnh chuyên dụng',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
