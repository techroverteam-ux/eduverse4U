import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParentsService } from './parents.service';
import { ParentsController } from './parents.controller';
import { Parent } from './entities/parent.entity';
import { Complaint } from './entities/complaint.entity';
import { Student } from '../students/entities/student.entity';
import { Grade } from '../students/entities/grade.entity';
import { Attendance } from '../attendance/entities/attendance.entity';
import { FeePayment } from '../fees/entities/fee-payment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Parent, Complaint, Student, Grade, Attendance, FeePayment])
  ],
  controllers: [ParentsController],
  providers: [ParentsService],
  exports: [ParentsService]
})
export class ParentsModule {}