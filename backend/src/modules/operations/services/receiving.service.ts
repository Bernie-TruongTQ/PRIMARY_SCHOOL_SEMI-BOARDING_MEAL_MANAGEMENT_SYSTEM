import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import {
  OperationsRepository,
  MealDeliveryRecord,
  MealInspectionRecord,
} from '../repositories/operations.repository';
import { ReceivingCheckinDto } from '../dto/receiving-checkin.dto';
import { ReceivingInspectDto } from '../dto/receiving-inspect.dto';

export interface InspectionResultResponse extends MealInspectionRecord {
  readyForDistribution: boolean;
}

@Injectable()
export class ReceivingService {
  private static readonly MIN_SAFE_TEMPERATURE = 65.0; // Quyết định 1246/QĐ-BYT

  constructor(private readonly operationsRepository: OperationsRepository) {}

  public async checkinVehicle(dto: ReceivingCheckinDto): Promise<MealDeliveryRecord> {
    const order = await this.operationsRepository.findOrderById(dto.cateringOrderId);
    if (!order) {
      throw new NotFoundException(`Catering Order with ID ${dto.cateringOrderId} not found.`);
    }

    return this.operationsRepository.saveDelivery({
      cateringOrderId: dto.cateringOrderId,
      vehiclePlate: dto.vehiclePlate,
      driverName: dto.driverName,
      thermalContainerCount: dto.thermalContainerCount,
      deliveredPortions: dto.deliveredPortions,
    });
  }

  public async inspectDelivery(dto: ReceivingInspectDto): Promise<InspectionResultResponse> {
    const delivery = await this.operationsRepository.findDeliveryById(dto.mealDeliveryId);
    if (!delivery) {
      throw new NotFoundException(`Meal Delivery record with ID ${dto.mealDeliveryId} not found.`);
    }

    this.enforceHaccpSafetyStandards(dto);

    const inspection = await this.operationsRepository.saveInspection({
      mealDeliveryId: dto.mealDeliveryId,
      coreTemperature: dto.coreTemperature,
      containerSealsIntact: dto.containerSealsIntact,
      sensoryEvalPass: dto.sensoryEvalPass,
      retentionSampleTaken: dto.retentionSampleTaken,
      thermometerPhotoUrl: dto.thermometerPhotoUrl,
      samplePhotoUrl: dto.samplePhotoUrl,
      notes: dto.notes,
      inspectionResult: 'passed',
      status: 'accepted',
    });

    return {
      ...inspection,
      readyForDistribution: true,
    };
  }

  private enforceHaccpSafetyStandards(dto: ReceivingInspectDto): void {
    if (dto.coreTemperature < ReceivingService.MIN_SAFE_TEMPERATURE) {
      throw new UnprocessableEntityException({
        code: 'HACCP_TEMP_DEFICIT',
        message: `Nhiệt độ thức ăn không đạt chuẩn an toàn thực phẩm (Quy định: >= ${ReceivingService.MIN_SAFE_TEMPERATURE}°C).`,
        details: [
          {
            measuredTemp: dto.coreTemperature,
            minimumAllowed: ReceivingService.MIN_SAFE_TEMPERATURE,
            riskLevel: 'CRITICAL_HAZARD',
          },
        ],
      });
    }

    if (!dto.containerSealsIntact || !dto.sensoryEvalPass || !dto.retentionSampleTaken) {
      throw new UnprocessableEntityException({
        code: 'HACCP_PROTOCOL_VIOLATION',
        message: 'Vi phạm quy trình kiểm thực 3 bước: Niêm phong rách, cảm quan không đạt, hoặc thiếu mẫu lưu 24h.',
      });
    }
  }
}
