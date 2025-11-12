import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './entities/student.entity';
import { Grade } from './entities/grade.entity';
import { User } from '../users/entities/user.entity';
import { Attendance } from '../attendance/entities/attendance.entity';
import { FeePayment } from '../fees/entities/fee-payment.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    @InjectRepository(Grade)
    private gradeRepository: Repository<Grade>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
    @InjectRepository(FeePayment)
    private feePaymentRepository: Repository<FeePayment>,
  ) {}

  async create(createStudentDto: any, tenantId: string) {
    // Create user account for student
    const hashedPassword = await bcrypt.hash('student123', 10);
    const user = this.userRepository.create({
      email: `${createStudentDto.admissionNumber}@student.local`,
      passwordHash: hashedPassword,
      firstName: createStudentDto.firstName,
      lastName: createStudentDto.lastName,
      role: 'student',
      tenantId,
    });
    const savedUser = await this.userRepository.save(user);

    // Find or create parent
    let parent = null;
    if (createStudentDto.parentEmail) {
      parent = await this.userRepository.findOne({
        where: { email: createStudentDto.parentEmail, tenantId }
      });
      
      if (!parent) {
        const parentPassword = await bcrypt.hash('parent123', 10);
        parent = this.userRepository.create({
          email: createStudentDto.parentEmail,
          passwordHash: parentPassword,
          firstName: createStudentDto.parentName || 'Parent',
          lastName: '',
          role: 'parent',
          tenantId,
        });
        parent = await this.userRepository.save(parent);
      }
    }

    const student = this.studentRepository.create({
      ...createStudentDto,
      userId: savedUser.id,
      parentId: parent?.id,
      tenantId,
    });

    return this.studentRepository.save(student);
  }

  async findAll(tenantId: string, query: any = {}) {
    const where: any = { tenantId };
    if (query.class) where.class = query.class;
    if (query.section) where.section = query.section;

    return this.studentRepository.find({
      where,
      relations: ['user', 'parent'],
      take: query.limit || 50,
      skip: (query.page - 1) * (query.limit || 50) || 0,
    });
  }

  async findOne(id: string, tenantId: string) {
    return this.studentRepository.findOne({
      where: { id, tenantId },
      relations: ['user', 'parent'],
    });
  }

  async update(id: string, updateStudentDto: any, tenantId: string) {
    await this.studentRepository.update({ id, tenantId }, updateStudentDto);
    return this.findOne(id, tenantId);
  }

  async remove(id: string, tenantId: string) {
    return this.studentRepository.update({ id, tenantId }, { isActive: false });
  }

  async findByUserId(userId: string): Promise<Student> {
    return this.studentRepository.findOne({ 
      where: { userId },
      relations: ['user', 'parent', 'grades', 'attendanceRecords', 'feePayments']
    });
  }

  async getStudentDashboard(studentId: string) {
    const student = await this.studentRepository.findOne({
      where: { id: studentId },
      relations: ['user', 'parent']
    });
    
    const recentGrades = await this.gradeRepository.find({
      where: { studentId },
      order: { createdAt: 'DESC' },
      take: 5
    });

    const attendanceStats = await this.attendanceRepository
      .createQueryBuilder('attendance')
      .select('COUNT(*)', 'total')
      .addSelect('SUM(CASE WHEN attendance.status = \'present\' THEN 1 ELSE 0 END)', 'present')
      .where('attendance.studentId = :studentId', { studentId })
      .getRawOne();

    const feeStatus = await this.feePaymentRepository
      .createQueryBuilder('payment')
      .select('SUM(payment.amount)', 'totalPaid')
      .addSelect('SUM(payment.pendingAmount)', 'totalPending')
      .where('payment.studentId = :studentId', { studentId })
      .getRawOne();

    return {
      student,
      recentGrades,
      attendanceStats: {
        total: parseInt(attendanceStats?.total || '0'),
        present: parseInt(attendanceStats?.present || '0'),
        percentage: attendanceStats?.total > 0 ? 
          (parseInt(attendanceStats.present || '0') / parseInt(attendanceStats.total)) * 100 : 0
      },
      feeStatus: {
        totalPaid: parseFloat(feeStatus?.totalPaid || '0'),
        totalPending: parseFloat(feeStatus?.totalPending || '0')
      }
    };
  }

  async getStudentGrades(studentId: string, filters?: any) {
    const query = this.gradeRepository.createQueryBuilder('grade')
      .where('grade.studentId = :studentId', { studentId });
    
    if (filters?.subject) {
      query.andWhere('grade.subject = :subject', { subject: filters.subject });
    }
    
    if (filters?.academicYear) {
      query.andWhere('grade.academicYear = :academicYear', { academicYear: filters.academicYear });
    }
    
    if (filters?.term) {
      query.andWhere('grade.term = :term', { term: filters.term });
    }

    return query.orderBy('grade.createdAt', 'DESC').getMany();
  }

  async getStudentAttendance(studentId: string, filters?: any) {
    const query = this.attendanceRepository.createQueryBuilder('attendance')
      .where('attendance.studentId = :studentId', { studentId });
    
    if (filters?.startDate && filters?.endDate) {
      query.andWhere('attendance.date BETWEEN :startDate AND :endDate', {
        startDate: filters.startDate,
        endDate: filters.endDate
      });
    }

    return query.orderBy('attendance.date', 'DESC').getMany();
  }

  async getStudentFees(studentId: string) {
    return this.feePaymentRepository.find({
      where: { studentId },
      order: { createdAt: 'DESC' }
    });
  }
}