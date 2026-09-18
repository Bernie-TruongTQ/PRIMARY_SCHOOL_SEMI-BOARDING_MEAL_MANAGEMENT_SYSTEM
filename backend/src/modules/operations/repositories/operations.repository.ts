import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma/prisma.service';

export interface MealDemandRecord {
  id: number;
  mealScheduleId: number;
  mealDate: string;
  confirmedAttendance: number;
  specialDietaryCount: number;
  bufferRate: number;
  bufferQuantity: number;
  finalDemandCount: number;
  determinationMethod: string;
  status: string;
  createdAt: Date;
}

export interface CateringOrderRecord {
  id: number;
  orderCode: string;
  mealDemandId: number;
  vendorName: string;
  totalOrderedPortions: number;
  standardPortions: number;
  specialDietaryPortions: number;
  status: string;
  dispatchedAt: Date;
  targetDeliveryTime?: string;
  notes?: string;
}

export interface MealDeliveryRecord {
  id: number;
  cateringOrderId: number;
  vehiclePlate: string;
  driverName: string;
  thermalContainerCount: number;
  deliveredPortions: number;
  arrivalTime: Date;
  status: string;
}

export interface MealInspectionRecord {
  id: number;
  mealDeliveryId: number;
  coreTemperature: number;
  containerSealsIntact: boolean;
  sensoryEvalPass: boolean;
  retentionSampleTaken: boolean;
  thermometerPhotoUrl?: string;
  samplePhotoUrl?: string;
  notes?: string;
  inspectedAt: Date;
  inspectionResult: 'passed' | 'rejected';
  status: 'accepted' | 'quarantined';
}

export interface DistributionRecord {
  id: number;
  mealDeliveryId: number;
  classId: number;
  allocatedPortions: number;
  specialDietaryPortions: number;
  receivedByTeacherId?: number;
  distributedAt: Date;
  status: string;
}

export interface ReconciliationRecord {
  id: number;
  cateringOrderId: number;
  mealDate: string;
  orderedCount: number;
  deliveredCount: number;
  consumedCount: number;
  payableCount: number;
  varianceType: string;
  discrepancyCount: number;
  status: string;
  reconciledAt: Date;
}

@Injectable()
export class OperationsRepository {
  private readonly logger = new Logger(OperationsRepository.name);

  // In-memory store for fast lookup and offline mode
  private demands = new Map<number, MealDemandRecord>();
  private orders = new Map<number, CateringOrderRecord>();
  private deliveries = new Map<number, MealDeliveryRecord>();
  private inspections = new Map<number, MealInspectionRecord>();
  private distributions = new Map<number, DistributionRecord>();
  private reconciliations = new Map<number, ReconciliationRecord>();

  private sequence = {
    demand: 900,
    order: 650,
    delivery: 320,
    inspection: 320,
    distribution: 710,
    reconciliation: 500,
  };

  constructor(private readonly prisma: PrismaService) {}

  public async saveDemand(record: Omit<MealDemandRecord, 'id' | 'createdAt'>): Promise<MealDemandRecord> {
    const id = ++this.sequence.demand;
    const demand: MealDemandRecord = {
      ...record,
      id,
      createdAt: new Date(),
    };
    this.demands.set(id, demand);
    return demand;
  }

  public async findDemandById(id: number): Promise<MealDemandRecord | null> {
    return this.demands.get(id) || null;
  }

  public async saveCateringOrder(
    record: Omit<CateringOrderRecord, 'id' | 'orderCode' | 'dispatchedAt' | 'status'>,
  ): Promise<CateringOrderRecord> {
    const id = ++this.sequence.order;
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const orderCode = `PO-${dateStr}-${String(id).slice(-2)}`;

    const order: CateringOrderRecord = {
      ...record,
      id,
      orderCode,
      dispatchedAt: now,
      status: 'dispatched',
    };
    this.orders.set(id, order);

    // Sync to Prisma VendorOrder if accessible
    try {
      await this.prisma.vendorOrder.upsert({
        where: { orderDate: new Date() },
        update: {
          headcount: order.standardPortions,
          totalMeals: order.totalOrderedPortions,
          dispatchedAt: order.dispatchedAt,
          status: 'DISPATCHED',
        },
        create: {
          orderDate: new Date(),
          headcount: order.standardPortions,
          totalMeals: order.totalOrderedPortions,
          dispatchedAt: order.dispatchedAt,
          status: 'DISPATCHED',
        },
      });
    } catch {
      this.logger.debug('Prisma sync skipped (operating in memory/offline mode).');
    }

    return order;
  }

  public async findOrderById(id: number): Promise<CateringOrderRecord | null> {
    return this.orders.get(id) || null;
  }

  public async saveDelivery(record: Omit<MealDeliveryRecord, 'id' | 'arrivalTime' | 'status'>): Promise<MealDeliveryRecord> {
    const id = ++this.sequence.delivery;
    const delivery: MealDeliveryRecord = {
      ...record,
      id,
      arrivalTime: new Date(),
      status: 'arrived',
    };
    this.deliveries.set(id, delivery);
    return delivery;
  }

  public async findDeliveryById(id: number): Promise<MealDeliveryRecord | null> {
    return this.deliveries.get(id) || null;
  }

  public async saveInspection(record: Omit<MealInspectionRecord, 'id' | 'inspectedAt'>): Promise<MealInspectionRecord> {
    const id = ++this.sequence.inspection;
    const inspection: MealInspectionRecord = {
      ...record,
      id,
      inspectedAt: new Date(),
    };
    this.inspections.set(id, inspection);
    return inspection;
  }

  public async findInspectionByDeliveryId(deliveryId: number): Promise<MealInspectionRecord | null> {
    for (const inspection of this.inspections.values()) {
      if (inspection.mealDeliveryId === deliveryId) {
        return inspection;
      }
    }
    return null;
  }

  public async saveDistribution(record: Omit<DistributionRecord, 'id' | 'distributedAt' | 'status'>): Promise<DistributionRecord> {
    const id = ++this.sequence.distribution;
    const distribution: DistributionRecord = {
      ...record,
      id,
      distributedAt: new Date(),
      status: 'delivered',
    };
    this.distributions.set(id, distribution);
    return distribution;
  }

  public async saveReconciliation(record: Omit<ReconciliationRecord, 'id' | 'reconciledAt' | 'status'>): Promise<ReconciliationRecord> {
    const id = ++this.sequence.reconciliation;
    const reconciliation: ReconciliationRecord = {
      ...record,
      id,
      reconciledAt: new Date(),
      status: 'reconciled',
    };
    this.reconciliations.set(id, reconciliation);
    return reconciliation;
  }
}
