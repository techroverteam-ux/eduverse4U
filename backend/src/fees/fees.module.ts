import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeesService } from './fees.service';
import { FeesController } from './fees.controller';
import { FeeStructure } from './entities/fee-structure.entity';
import { FeePayment } from './entities/fee-payment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FeeStructure, FeePayment])],
  controllers: [FeesController],
  providers: [FeesService],
})
export class FeesModule {}