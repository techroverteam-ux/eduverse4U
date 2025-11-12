import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from '../students/entities/student.entity';
import { FeePayment } from '../fees/entities/fee-payment.entity';
import { Attendance } from '../attendance/entities/attendance.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    @InjectRepository(FeePayment)
    private feePaymentRepository: Repository<FeePayment>,
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
  ) {}

  async generateFeeReceipt(paymentId: string, tenantId: string) {
    const payment = await this.feePaymentRepository.findOne({
      where: { id: paymentId, tenantId },
      relations: ['student', 'student.user', 'feeStructure'],
    });

    if (!payment) return null;

    return {
      receiptNumber: payment.receiptNumber,
      date: payment.paymentDate,
      student: {
        name: `${payment.student.user.firstName} ${payment.student.user.lastName}`,
        admissionNumber: payment.student.admissionNumber,
        class: payment.student.class,
        section: payment.student.section,
      },
      fee: {
        name: payment.feeStructure.name,
        amount: payment.amount,
        method: payment.paymentMethod,
      },
    };
  }

  async getDashboardStats(tenantId: string) {
    const [totalStudents, totalFees, todayAttendance] = await Promise.all([
      this.studentRepository.count({ where: { tenantId, isActive: true } }),
      this.feePaymentRepository
        .createQueryBuilder('payment')
        .select('SUM(payment.amount)', 'total')
        .where('payment.tenantId = :tenantId', { tenantId })
        .getRawOne(),
      this.attendanceRepository
        .createQueryBuilder('attendance')
        .select('COUNT(*)', 'total')
        .addSelect('SUM(CASE WHEN status = \'present\' THEN 1 ELSE 0 END)', 'present')
        .where('attendance.tenantId = :tenantId', { tenantId })
        .andWhere('DATE(attendance.date) = CURRENT_DATE')
        .getRawOne(),
    ]);

    const attendancePercentage = todayAttendance.total > 0 
      ? (todayAttendance.present / todayAttendance.total) * 100 
      : 0;

    return {
      totalStudents,
      totalFees: totalFees.total || 0,
      attendanceToday: Math.round(attendancePercentage * 10) / 10,
      pendingPayments: 0, // Calculate based on due dates
    };
  }

  async getStudentCertificate(studentId: string, tenantId: string) {
    const student = await this.studentRepository.findOne({
      where: { id: studentId, tenantId },
      relations: ['user', 'tenant'],
    });

    if (!student) return null;

    return {
      studentName: `${student.user.firstName} ${student.user.lastName}`,
      admissionNumber: student.admissionNumber,
      class: student.class,
      section: student.section,
      schoolName: student.tenant.name,
      issueDate: new Date().toISOString().split('T')[0],
    };
  }
}