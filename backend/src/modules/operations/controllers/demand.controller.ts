import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Role, Roles } from '../../../common/decorators/roles.decorator';
import { DemandService, DemandCalculationResponse } from '../services/demand.service';
import { CateringDispatchService, DispatchOrderResponse } from '../services/catering-dispatch.service';
import { CalculateDemandDto } from '../dto/calculate-demand.dto';
import { DispatchOrderDto } from '../dto/dispatch-order.dto';

@ApiTags('Operations - Demand & Procurement (Domain 3)')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller('demands')
export class DemandController {
  constructor(
    private readonly demandService: DemandService,
    private readonly cateringDispatchService: CateringDispatchService,
  ) {}

  @Post('calculate')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.MGR, Role.ADM)
  @ApiOperation({
    summary: 'Aggregate Lunch Demand & Calculate Safety Buffer (08:30 AM Cutoff)',
    description:
      'Aggregates confirmed class attendees and applies safety buffer margin (0% - 10%). Enforces statutory cutoff.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Demand calculation succeeded with breakdown of dietary requirements.',
  })
  public async calculateDemand(
    @Body() dto: CalculateDemandDto,
  ): Promise<{ success: boolean; data: DemandCalculationResponse; metadata: { timestamp: string } }> {
    const data = await this.demandService.calculateDemand(dto);
    return {
      success: true,
      data,
      metadata: {
        timestamp: new Date().toISOString(),
      },
    };
  }

  @Post('dispatch-order')
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.MGR, Role.ADM)
  @ApiOperation({
    summary: 'Dispatch Purchase Order to External Catering Vendor (Before 08:45 AM)',
    description:
      'Generates formal purchase order record and transmits payload electronically to catering vendor partner.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'PO generated and dispatched to vendor.',
  })
  public async dispatchOrder(
    @Body() dto: DispatchOrderDto,
  ): Promise<{ success: boolean; data: DispatchOrderResponse; metadata: { timestamp: string } }> {
    const data = await this.cateringDispatchService.dispatchOrder(dto);
    return {
      success: true,
      data,
      metadata: {
        timestamp: new Date().toISOString(),
      },
    };
  }
}
