import { Controller, Post, Get, Body, UseGuards, Request, Res } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BulkService } from './bulk.service';

@Controller('bulk')
@UseGuards(JwtAuthGuard)
export class BulkController {
  constructor(private readonly bulkService: BulkService) {}

  @Post('import/students')
  async importStudents(@Body() body: { csvData: string }, @Request() req) {
    return this.bulkService.importStudents(body.csvData, req.user.tenantId);
  }

  @Get('export/students')
  async exportStudents(@Request() req, @Res() res: Response) {
    const csvData = await this.bulkService.exportStudents(req.user.tenantId);
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=students.csv');
    res.send(csvData);
  }

  @Get('export/payments')
  async exportPayments(@Request() req, @Res() res: Response) {
    const csvData = await this.bulkService.exportFeePayments(req.user.tenantId);
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=fee_payments.csv');
    res.send(csvData);
  }
}