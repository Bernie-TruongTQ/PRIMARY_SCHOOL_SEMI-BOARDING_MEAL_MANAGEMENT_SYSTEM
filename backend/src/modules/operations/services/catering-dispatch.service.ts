import { Injectable, NotFoundException } from '@nestjs/common';
import { OperationsRepository, CateringOrderRecord } from '../repositories/operations.repository';
import { DispatchOrderDto } from '../dto/dispatch-order.dto';

export interface DispatchOrderResponse extends CateringOrderRecord {
  vendorAcknowledged: boolean;
  vendorTrackingRef: string;
}

@Injectable()
export class CateringDispatchService {
  constructor(private readonly operationsRepository: OperationsRepository) {}

  public async dispatchOrder(dto: DispatchOrderDto): Promise<DispatchOrderResponse> {
    const demand = await this.operationsRepository.findDemandById(dto.mealDemandId);
    if (!demand) {
      throw new NotFoundException(`Cannot dispatch order: Meal Demand with ID ${dto.mealDemandId} not found.`);
    }

    const specialDietaryPortions = demand.specialDietaryCount;
    const standardPortions = demand.finalDemandCount - specialDietaryPortions;

    const order = await this.operationsRepository.saveCateringOrder({
      mealDemandId: dto.mealDemandId,
      vendorName: dto.vendorName,
      totalOrderedPortions: demand.finalDemandCount,
      standardPortions,
      specialDietaryPortions,
      targetDeliveryTime: dto.targetDeliveryTime,
      notes: dto.notes,
    });

    return {
      ...order,
      vendorAcknowledged: true,
      vendorTrackingRef: `SF-VN-${Math.floor(10000 + Math.random() * 90000)}`,
    };
  }

  public async getOrderById(orderId: number): Promise<CateringOrderRecord> {
    const order = await this.operationsRepository.findOrderById(orderId);
    if (!order) {
      throw new NotFoundException(`Catering Order with ID ${orderId} not found.`);
    }
    return order;
  }
}
