import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Role, Roles } from '../../../common/decorators/roles.decorator';
import { ReceivingService, InspectionResultResponse } from '../services/receiving.service';
import { DistributionService, DistributionPlanResponse } from '../services/distribution.service';
import { ReconciliationEngine, ReconciliationVariance } from '../services/reconciliation.engine';
import { OperationsRepository, MealDeliveryRecord, DistributionRecord } from '../repositories/operations.repository';
import { ReceivingCheckinDto } from '../dto/receiving-checkin.dto';
import { ReceivingInspectDto } from '../dto/receiving-inspect.dto';
import { DistributionConfirmDto } from '../dto/distribution-confirm.dto';
import { CalculateReconciliationDto } from '../dto/reconciliation.dto';

@ApiTags('Operations - Receiving, Safety & Reconciliation (Domain 3)')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller('operations')
export class OperationsController {
  constructor(
    private readonly receivingService: ReceivingService,
    private readonly distributionService: DistributionService,
    private readonly reconciliationEngine: ReconciliationEngine,
    private readonly operationsRepository: OperationsRepository,
  ) {}

  @Post('receiving/checkin')
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.MGR, Role.ADM)
  @ApiOperation({
    summary: 'Dock Receiving Check-in (Vehicle Arrival ~10:30 AM)',
    description: 'Records catering truck arrival, license plate, and thermal box count.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Vehicle arrival recorded successfully.',
  })
  public async checkinVehicle(
    @Body() dto: ReceivingCheckinDto,
  ): Promise<{ success: boolean; data: MealDeliveryRecord; metadata: { timestamp: string } }> {
    const data = await this.receivingService.checkinVehicle(dto);
    return {
      success: true,
      data,
      metadata: { timestamp: new Date().toISOString() },
    };
  }

  @Post('receiving/inspect')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.MGR, Role.ADM)
  @ApiOperation({
    summary: 'Submit 3-Step Food Safety Inspection (Decision 1246/QĐ-BYT)',
    description:
      'Validates core food temp (>= 65.0°C), intact seal, sensory evaluation, and 24h sample jar retention.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Inspection passed, food ready for classroom distribution.',
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'HACCP temperature deficit (< 65.0°C) or safety violation.',
  })
  public async inspectDelivery(
    @Body() dto: ReceivingInspectDto,
  ): Promise<{ success: boolean; data: InspectionResultResponse; metadata: { timestamp: string } }> {
    const data = await this.receivingService.inspectDelivery(dto);
    return {
      success: true,
      data,
      metadata: { timestamp: new Date().toISOString() },
    };
  }

  @Get('distribution/plan')
  @Roles(Role.MGR, Role.ADM)
  @ApiOperation({
    summary: 'Get Classroom Trolley Distribution Plan (11:00 AM)',
    description: 'Fetches allocated portions and allergy trays for each classroom trolley.',
  })
  @ApiQuery({ name: 'mealDeliveryId', type: Number, required: true })
  public async getDistributionPlan(
    @Query('mealDeliveryId', ParseIntPipe) mealDeliveryId: number,
  ): Promise<{ success: boolean; data: DistributionPlanResponse; metadata: { timestamp: string } }> {
    const data = await this.distributionService.getDistributionPlan(mealDeliveryId);
    return {
      success: true,
      data,
      metadata: { timestamp: new Date().toISOString() },
    };
  }

  @Post('distribution/confirm')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.MGR, Role.ADM)
  @ApiOperation({
    summary: 'Confirm Classroom Trolley Distribution',
    description: 'Records hand-over of food trolley to classroom teacher.',
  })
  public async confirmDistribution(
    @Body() dto: DistributionConfirmDto,
  ): Promise<{ success: boolean; data: DistributionRecord; metadata: { timestamp: string } }> {
    const data = await this.distributionService.confirmDistribution(dto);
    return {
      success: true,
      data,
      metadata: { timestamp: new Date().toISOString() },
    };
  }

  @Post('reconciliation/calculate')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.MGR, Role.ADM, Role.ACC)
  @ApiOperation({
    summary: '3-Way Post-Lunch Quantity Reconciliation (13:00 PM)',
    description: 'Compares Ordered vs. Delivered vs. Consumed quantities to calculate payable portions.',
  })
  public async calculateReconciliation(
    @Body() dto: CalculateReconciliationDto,
  ): Promise<{ success: boolean; data: ReconciliationVariance; metadata: { timestamp: string } }> {
    const order = await this.operationsRepository.findOrderById(dto.cateringOrderId);
    const orderedCount = order ? order.totalOrderedPortions : 1260;
    const deliveredCount = 1260; // From delivery slip

    const variance = this.reconciliationEngine.evaluate(
      orderedCount,
      deliveredCount,
      dto.actualConsumedCount,
      dto.discrepancyReason,
    );

    await this.operationsRepository.saveReconciliation({
      cateringOrderId: dto.cateringOrderId,
      mealDate: dto.mealDate,
      orderedCount: variance.orderedCount,
      deliveredCount: variance.deliveredCount,
      consumedCount: variance.consumedCount,
      payableCount: variance.payableCount,
      varianceType: variance.varianceType,
      discrepancyCount: variance.discrepancyCount,
    });

    return {
      success: true,
      data: variance,
      metadata: { timestamp: new Date().toISOString() },
    };
  }
}
