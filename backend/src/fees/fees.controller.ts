import { Controller, Get, Post, Body, UseGuards, Request, Query, Param } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FeesService } from './fees.service';

@Controller('fees')
@UseGuards(JwtAuthGuard)
export class FeesController {
  constructor(private readonly feesService: FeesService) {}

  @Post('structures')
  createStructure(@Body() createFeeDto: any, @Request() req) {
    return this.feesService.createStructure(createFeeDto, req.user.tenantId);
  }

  @Get('structures')
  getStructures(@Request() req, @Query('class') classFilter: string) {
    return this.feesService.getStructures(req.user.tenantId, classFilter);
  }

  @Post('payments')
  recordPayment(@Body() paymentDto: any, @Request() req) {
    return this.feesService.recordPayment(paymentDto, req.user.tenantId);
  }

  @Get('payments')
  getPayments(@Request() req, @Query() filters) {
    return this.feesService.getPayments(req.user.tenantId, filters);
  }

  @Get('receipts/:paymentId')
  getReceipt(@Param('paymentId') paymentId: string, @Request() req) {
    return this.feesService.getPaymentReceipt(paymentId, req.user.tenantId);
  }
}