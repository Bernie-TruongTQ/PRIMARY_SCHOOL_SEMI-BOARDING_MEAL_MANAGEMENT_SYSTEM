import { Injectable, NotFoundException } from '@nestjs/common';
import { BufferEngine } from './buffer.engine';
import { OperationsRepository, MealDemandRecord } from '../repositories/operations.repository';
import { CalculateDemandDto } from '../dto/calculate-demand.dto';

export interface DishRequirement {
  dishId: number;
  name: string;
  expectedQuantity: number;
  unit: string;
}

export interface DemandCalculationResponse extends MealDemandRecord {
  dishBreakdown: DishRequirement[];
}

@Injectable()
export class DemandService {
  constructor(
    private readonly bufferEngine: BufferEngine,
    private readonly operationsRepository: OperationsRepository,
  ) {}

  public async calculateDemand(dto: CalculateDemandDto): Promise<DemandCalculationResponse> {
    // In production, confirmedAttendance is queried from DailyAttendance roster locked at 08:30
    const confirmedAttendance = 1200;
    const specialDietaryCount = 18;
    const bufferRate = dto.bufferRate ?? 0.05;

    const bufferResult = this.bufferEngine.calculate(confirmedAttendance, bufferRate);

    const todayStr = new Date().toISOString().slice(0, 10);
    const demandRecord = await this.operationsRepository.saveDemand({
      mealScheduleId: dto.mealScheduleId,
      mealDate: todayStr,
      confirmedAttendance: bufferResult.confirmedAttendance,
      specialDietaryCount,
      bufferRate: bufferResult.bufferRate,
      bufferQuantity: bufferResult.bufferQuantity,
      finalDemandCount: bufferResult.finalDemandCount,
      determinationMethod: 'attendance_based',
      status: 'calculated',
    });

    const dishBreakdown = this.generateDishBreakdown(demandRecord.finalDemandCount);

    return {
      ...demandRecord,
      dishBreakdown,
    };
  }

  public async getDemandById(demandId: number): Promise<MealDemandRecord> {
    const demand = await this.operationsRepository.findDemandById(demandId);
    if (!demand) {
      throw new NotFoundException(`Meal demand with ID ${demandId} not found.`);
    }
    return demand;
  }

  private generateDishBreakdown(finalDemandCount: number): DishRequirement[] {
    // Standard catering portion ratios per 1000 portions
    return [
      {
        dishId: 101,
        name: 'Thịt heo kho trứng cút',
        expectedQuantity: Number(((finalDemandCount * 0.1).toFixed(1))),
        unit: 'kg',
      },
      {
        dishId: 102,
        name: 'Canh bí xanh nấu thịt nạc',
        expectedQuantity: Number(((finalDemandCount * 0.15).toFixed(1))),
        unit: 'liters',
      },
      {
        dishId: 103,
        name: 'Cơm trắng gạo dẻo',
        expectedQuantity: Number(((finalDemandCount * 0.12).toFixed(1))),
        unit: 'kg',
      },
    ];
  }
}
