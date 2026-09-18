import { Injectable } from '@nestjs/common';

export interface ReconciliationVariance {
  readonly orderedCount: number;
  readonly deliveredCount: number;
  readonly consumedCount: number;
  readonly payableCount: number;
  readonly varianceType: 'MATCHED' | 'OVER_DELIVERED' | 'SHORT_DELIVERED' | 'LEFTOVER_WASTE';
  readonly discrepancyCount: number;
  readonly financialImpactNote: string;
}

@Injectable()
export class ReconciliationEngine {
  public evaluate(
    orderedCount: number,
    deliveredCount: number,
    consumedCount: number,
    reason?: string,
  ): ReconciliationVariance {
    this.validateMetrics(orderedCount, deliveredCount, consumedCount);

    // Statutory rule: Payable to vendor is min(Ordered, Delivered) unless explicit authorization
    const payableCount = Math.min(orderedCount, deliveredCount);
    const deliveryVariance = deliveredCount - orderedCount;
    const consumptionVariance = consumedCount - deliveredCount;

    let varianceType: ReconciliationVariance['varianceType'] = 'MATCHED';
    let financialImpactNote = 'Reconciliation matched within normal operating bounds.';

    if (deliveryVariance > 0) {
      varianceType = 'OVER_DELIVERED';
      financialImpactNote = `Vendor over-delivered by ${deliveryVariance} portions. Surplus not included in statutory payable.`;
    } else if (deliveryVariance < 0) {
      varianceType = 'SHORT_DELIVERED';
      financialImpactNote = `Vendor delivered short by ${Math.abs(deliveryVariance)} portions. Payable adjusted downward.`;
    } else if (consumptionVariance < 0) {
      varianceType = 'LEFTOVER_WASTE';
      financialImpactNote = `${Math.abs(consumptionVariance)} portions left unconsumed due to attendance anomalies. Note: ${reason || 'No justification provided'}`;
    }

    return {
      orderedCount,
      deliveredCount,
      consumedCount,
      payableCount,
      varianceType,
      discrepancyCount: Math.abs(deliveryVariance),
      financialImpactNote,
    };
  }

  private validateMetrics(ordered: number, delivered: number, consumed: number): void {
    if (ordered < 0 || delivered < 0 || consumed < 0) {
      throw new Error('Reconciliation metrics cannot be negative values.');
    }
  }
}
