import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BulkService } from './bulk.service';
import { BulkController } from './bulk.controller';
import { Student } from '../students/entities/student.entity';
import { User } from '../users/entities/user.entity';
import { FeePayment } from '../fees/entities/fee-payment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Student, User, FeePayment])],
  controllers: [BulkController],
  providers: [BulkService],
})
export class BulkModule {}