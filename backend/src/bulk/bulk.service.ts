import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from '../students/entities/student.entity';
import { User } from '../users/entities/user.entity';
import { FeePayment } from '../fees/entities/fee-payment.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class BulkService {
  constructor(
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(FeePayment)
    private feePaymentRepository: Repository<FeePayment>,
  ) {}

  async importStudents(csvData: string, tenantId: string) {
    const lines = csvData.split('\n').slice(1);
    const results = { success: 0, errors: [] };

    for (const line of lines) {
      if (!line.trim()) continue;
      
      const [admissionNumber, firstName, lastName, className, section, parentEmail] = line.split(',');
      
      try {
        const hashedPassword = await bcrypt.hash('student123', 10);
        const user = this.userRepository.create({
          email: `${admissionNumber}@student.local`,
          passwordHash: hashedPassword,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          role: 'student',
          tenantId,
        });
        const savedUser = await this.userRepository.save(user);

        const student = this.studentRepository.create({
          admissionNumber: admissionNumber.trim(),
          class: className.trim(),
          section: section?.trim() || null,
          userId: savedUser.id,
          tenantId,
        });

        await this.studentRepository.save(student);
        results.success++;
      } catch (error) {
        results.errors.push(`Error: ${error.message}`);
      }
    }

    return results;
  }

  async exportStudents(tenantId: string) {
    const students = await this.studentRepository.find({
      where: { tenantId, isActive: true },
      relations: ['user', 'parent'],
    });

    const csvHeader = 'admission_number,first_name,last_name,class,section,parent_email\n';
    const csvData = students.map(student => 
      `${student.admissionNumber},${student.user.firstName},${student.user.lastName},${student.class},${student.section || ''},${student.parent?.email || ''}`
    ).join('\n');

    return csvHeader + csvData;
  }

  async exportFeePayments(tenantId: string) {
    const payments = await this.feePaymentRepository.find({
      where: { tenantId },
      relations: ['student', 'student.user'],
    });

    const csvHeader = 'receipt_number,student_name,admission_number,amount,payment_date,method\n';
    const csvData = payments.map(payment => 
      `${payment.receiptNumber},${payment.student.user.firstName} ${payment.student.user.lastName},${payment.student.admissionNumber},${payment.amount},${payment.paymentDate},${payment.paymentMethod}`
    ).join('\n');

    return csvHeader + csvData;
  }
}