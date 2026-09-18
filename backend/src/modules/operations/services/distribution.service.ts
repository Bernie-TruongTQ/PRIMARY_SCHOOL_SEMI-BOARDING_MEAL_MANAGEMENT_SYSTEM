import { Injectable, NotFoundException } from '@nestjs/common';
import {
  OperationsRepository,
  DistributionRecord,
} from '../repositories/operations.repository';
import { DistributionConfirmDto } from '../dto/distribution-confirm.dto';

export interface ClassroomTrolleyAllocation {
  classId: number;
  className: string;
  location: string;
  allocatedPortions: number;
  specialDietaryPortions: number;
  dietaryNote: string;
  status: 'preparing' | 'delivered';
}

export interface DistributionPlanResponse {
  deliveryId: number;
  totalPortionsToDistribute: number;
  classes: ClassroomTrolleyAllocation[];
}

@Injectable()
export class DistributionService {
  constructor(private readonly operationsRepository: OperationsRepository) {}

  public async getDistributionPlan(deliveryId: number): Promise<DistributionPlanResponse> {
    const delivery = await this.operationsRepository.findDeliveryById(deliveryId);
    if (!delivery) {
      throw new NotFoundException(`Meal delivery with ID ${deliveryId} not found.`);
    }

    const inspection = await this.operationsRepository.findInspectionByDeliveryId(deliveryId);
    if (!inspection || inspection.status !== 'accepted') {
      throw new NotFoundException(
        `Delivery #${deliveryId} has not passed food safety inspection (Decision 1246/QĐ-BYT).`,
      );
    }

    return {
      deliveryId,
      totalPortionsToDistribute: delivery.deliveredPortions,
      classes: this.generateClassroomAllocations(),
    };
  }

  public async confirmDistribution(dto: DistributionConfirmDto): Promise<DistributionRecord> {
    const delivery = await this.operationsRepository.findDeliveryById(dto.mealDeliveryId);
    if (!delivery) {
      throw new NotFoundException(`Meal delivery with ID ${dto.mealDeliveryId} not found.`);
    }

    return this.operationsRepository.saveDistribution({
      mealDeliveryId: dto.mealDeliveryId,
      classId: dto.classId,
      allocatedPortions: dto.allocatedPortions,
      specialDietaryPortions: dto.specialDietaryPortions ?? 0,
      receivedByTeacherId: dto.receivedByTeacherId,
    });
  }

  private generateClassroomAllocations(): ClassroomTrolleyAllocation[] {
    return [
      {
        classId: 12,
        className: '2A',
        location: 'Phòng 204 - Dãy B',
        allocatedPortions: 28,
        specialDietaryPortions: 1,
        dietaryNote: '1 khay không hải sản (HS Nguyễn Hoàng Nam)',
        status: 'preparing',
      },
      {
        classId: 13,
        className: '2B',
        location: 'Phòng 205 - Dãy B',
        allocatedPortions: 30,
        specialDietaryPortions: 0,
        dietaryNote: 'Không có dị ứng đặc biệt',
        status: 'preparing',
      },
    ];
  }
}
