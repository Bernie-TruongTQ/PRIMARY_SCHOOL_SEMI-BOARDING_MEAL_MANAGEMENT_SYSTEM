import { UnprocessableEntityException } from '@nestjs/common';
import { BufferEngine } from './buffer.engine';
import { ReconciliationEngine } from './reconciliation.engine';
import { ReceivingService } from './receiving.service';
import { OperationsRepository } from '../repositories/operations.repository';
import { PrismaService } from '../../../database/prisma/prisma.service';

describe('Operations Domain Unit Tests (Clean Code & Business Rules)', () => {
  describe('BufferEngine', () => {
    let bufferEngine: BufferEngine;

    beforeEach(() => {
      bufferEngine = new BufferEngine();
    });

    it('should calculate correct buffer count with 5% safety rate (Math.ceil)', () => {
      const result = bufferEngine.calculate(1200, 0.05);
      expect(result.confirmedAttendance).toBe(1200);
      expect(result.bufferQuantity).toBe(60);
      expect(result.finalDemandCount).toBe(1260);
    });

    it('should calculate buffer ceiling correctly when fractions occur', () => {
      const result = bufferEngine.calculate(21, 0.05); // 21 * 0.05 = 1.05 -> ceil = 2
      expect(result.bufferQuantity).toBe(2);
      expect(result.finalDemandCount).toBe(23);
    });

    it('should throw error when buffer rate exceeds statutory bounds (> 10%)', () => {
      expect(() => bufferEngine.calculate(100, 0.15)).toThrow(
        /Buffer rate must be within 0% and 10%/,
      );
    });
  });

  describe('ReconciliationEngine', () => {
    let reconciliationEngine: ReconciliationEngine;

    beforeEach(() => {
      reconciliationEngine = new ReconciliationEngine();
    });

    it('should return MATCHED when ordered, delivered, and consumed align', () => {
      const result = reconciliationEngine.evaluate(1260, 1260, 1260);
      expect(result.varianceType).toBe('MATCHED');
      expect(result.payableCount).toBe(1260);
      expect(result.discrepancyCount).toBe(0);
    });

    it('should adjust payable downward on SHORT_DELIVERED', () => {
      const result = reconciliationEngine.evaluate(1260, 1240, 1240);
      expect(result.varianceType).toBe('SHORT_DELIVERED');
      expect(result.payableCount).toBe(1240);
      expect(result.discrepancyCount).toBe(20);
    });

    it('should not pay for unrequested surplus on OVER_DELIVERED', () => {
      const result = reconciliationEngine.evaluate(1260, 1280, 1260);
      expect(result.varianceType).toBe('OVER_DELIVERED');
      expect(result.payableCount).toBe(1260);
      expect(result.discrepancyCount).toBe(20);
    });
  });

  describe('ReceivingService HACCP Temperature Rule (Decision 1246/QĐ-BYT)', () => {
    let receivingService: ReceivingService;
    let operationsRepository: OperationsRepository;

    beforeEach(() => {
      const prismaService = {} as PrismaService;
      operationsRepository = new OperationsRepository(prismaService);
      receivingService = new ReceivingService(operationsRepository);
    });

    it('should reject food delivery if core temperature is below 65.0°C with 422 HACCP_TEMP_DEFICIT', async () => {
      const delivery = await operationsRepository.saveDelivery({
        cateringOrderId: 650,
        vehiclePlate: '29H-882.14',
        driverName: 'Vũ Văn Thắng',
        thermalContainerCount: 42,
        deliveredPortions: 1260,
      });

      await expect(
        receivingService.inspectDelivery({
          mealDeliveryId: delivery.id,
          coreTemperature: 58.2, // Below 65.0°C
          containerSealsIntact: true,
          sensoryEvalPass: true,
          retentionSampleTaken: true,
        }),
      ).rejects.toThrow(UnprocessableEntityException);
    });

    it('should accept delivery if core temperature is >= 65.0°C and all safety criteria pass', async () => {
      const delivery = await operationsRepository.saveDelivery({
        cateringOrderId: 650,
        vehiclePlate: '29H-882.14',
        driverName: 'Vũ Văn Thắng',
        thermalContainerCount: 42,
        deliveredPortions: 1260,
      });

      const inspection = await receivingService.inspectDelivery({
        mealDeliveryId: delivery.id,
        coreTemperature: 72.5,
        containerSealsIntact: true,
        sensoryEvalPass: true,
        retentionSampleTaken: true,
      });

      expect(inspection.inspectionResult).toBe('passed');
      expect(inspection.status).toBe('accepted');
      expect(inspection.readyForDistribution).toBe(true);
    });
  });
});
