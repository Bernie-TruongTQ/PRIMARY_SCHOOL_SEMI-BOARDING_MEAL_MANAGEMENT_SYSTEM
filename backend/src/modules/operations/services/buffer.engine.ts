import { Injectable } from '@nestjs/common';

export interface BufferCalculationResult {
  readonly confirmedAttendance: number;
  readonly bufferRate: number;
  readonly bufferQuantity: number;
  readonly finalDemandCount: number;
}

@Injectable()
export class BufferEngine {
  private static readonly MIN_BUFFER_RATE = 0.0;
  private static readonly MAX_BUFFER_RATE = 0.1;

  public calculate(confirmedAttendance: number, bufferRate: number = 0.05): BufferCalculationResult {
    this.validateInputs(confirmedAttendance, bufferRate);

    const bufferQuantity = Math.ceil(confirmedAttendance * bufferRate);
    const finalDemandCount = confirmedAttendance + bufferQuantity;

    return {
      confirmedAttendance,
      bufferRate,
      bufferQuantity,
      finalDemandCount,
    };
  }

  private validateInputs(attendance: number, rate: number): void {
    if (attendance < 0) {
      throw new Error('Confirmed attendance headcount cannot be negative.');
    }
    if (rate < BufferEngine.MIN_BUFFER_RATE || rate > BufferEngine.MAX_BUFFER_RATE) {
      throw new Error(
        `Buffer rate must be within ${BufferEngine.MIN_BUFFER_RATE * 100}% and ${BufferEngine.MAX_BUFFER_RATE * 100}%. Received: ${rate * 100}%`,
      );
    }
  }
}
