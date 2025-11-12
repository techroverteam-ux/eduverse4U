import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FeeStructure } from './entities/fee-structure.entity';
import { FeePayment } from './entities/fee-payment.entity';

@Injectable()
export class FeesService {
  constructor(
    @InjectRepository(FeeStructure)
    private feeStructureRepository: Repository<FeeStructure>,
    @InjectRepository(FeePayment)
    private feePaymentRepository: Repository<FeePayment>,
  ) {}

  async createStructure(createFeeDto: any, tenantId: string) {
    const feeStructure = this.feeStructureRepository.create({
      ...createFeeDto,
      tenantId,
    });
    return this.feeStructureRepository.save(feeStructure);
  }

  async getStructures(tenantId: string, classFilter?: string) {
    const where: any = { tenantId, isActive: true };
    if (classFilter) where.class = classFilter;
    
    return this.feeStructureRepository.find({ where });
  }

  async recordPayment(paymentDto: any, tenantId: string) {
    const receiptNumber = `RCP${Date.now()}`;
    
    const payment = this.feePaymentRepository.create({
      ...paymentDto,
      tenantId,
      receiptNumber,
    });
    
    return this.feePaymentRepository.save(payment);
  }

  async getPayments(tenantId: string, filters: any = {}) {
    const where: any = { tenantId };
    if (filters.studentId) where.studentId = filters.studentId;
    
    return this.feePaymentRepository.find({
      where,
      relations: ['student', 'feeStructure'],
      order: { createdAt: 'DESC' },
    });
  }

  async getPaymentReceipt(paymentId: string, tenantId: string) {
    return this.feePaymentRepository.findOne({
      where: { id: paymentId, tenantId },
      relations: ['student', 'feeStructure'],
    });
  }
}