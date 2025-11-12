import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Parent } from './entities/parent.entity';
import { Complaint } from './entities/complaint.entity';
import { Student } from '../students/entities/student.entity';
import { Grade } from '../students/entities/grade.entity';
import { Attendance } from '../attendance/entities/attendance.entity';
import { FeePayment } from '../fees/entities/fee-payment.entity';

@Injectable()
export class ParentsService {
  constructor(
    @InjectRepository(Parent)
    private parentRepository: Repository<Parent>,
    @InjectRepository(Complaint)
    private complaintRepository: Repository<Complaint>,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    @InjectRepository(Grade)
    private gradeRepository: Repository<Grade>,
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
    @InjectRepository(FeePayment)
    private feePaymentRepository: Repository<FeePayment>,
  ) {}

  async findByUserId(userId: string): Promise<Parent> {
    return this.parentRepository.findOne({
      where: { userId },
      relations: ['user', 'children', 'children.user', 'complaints']
    });
  }

  async getParentDashboard(parentId: string) {
    const parent = await this.parentRepository.findOne({
      where: { id: parentId },
      relations: ['children', 'children.user', 'complaints']
    });

    const childrenData = await Promise.all(
      parent.children.map(async (child) => {
        const recentGrades = await this.gradeRepository.find({
          where: { studentId: child.id },
          order: { createdAt: 'DESC' },
          take: 3
        });

        const attendanceStats = await this.attendanceRepository
          .createQueryBuilder('attendance')
          .select('COUNT(*)', 'total')
          .addSelect('SUM(CASE WHEN attendance.status = \'present\' THEN 1 ELSE 0 END)', 'present')
          .where('attendance.studentId = :studentId', { studentId: child.id })
          .getRawOne();

        const feeStatus = await this.feePaymentRepository
          .createQueryBuilder('payment')
          .select('SUM(payment.amount)', 'totalPaid')
          .addSelect('SUM(payment.pendingAmount)', 'totalPending')
          .where('payment.studentId = :studentId', { studentId: child.id })
          .getRawOne();

        return {
          student: child,
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
      })
    );

    const recentComplaints = await this.complaintRepository.find({
      where: { parentId },
      order: { createdAt: 'DESC' },
      take: 5,
      relations: ['student', 'student.user']
    });

    return {
      parent,
      children: childrenData,
      recentComplaints,
      totalChildren: parent.children.length,
      openComplaints: recentComplaints.filter(c => c.status === 'open').length
    };
  }

  async getChildGrades(studentId: string, parentId: string) {
    // Verify parent has access to this child
    const parent = await this.parentRepository.findOne({
      where: { id: parentId },
      relations: ['children']
    });

    if (!parent.children.some(child => child.id === studentId)) {
      throw new Error('Access denied');
    }

    return this.gradeRepository.find({
      where: { studentId },
      order: { createdAt: 'DESC' }
    });
  }

  async getChildAttendance(studentId: string, parentId: string, filters?: any) {
    const parent = await this.parentRepository.findOne({
      where: { id: parentId },
      relations: ['children']
    });

    if (!parent.children.some(child => child.id === studentId)) {
      throw new Error('Access denied');
    }

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

  async getChildFees(studentId: string, parentId: string) {
    const parent = await this.parentRepository.findOne({
      where: { id: parentId },
      relations: ['children']
    });

    if (!parent.children.some(child => child.id === studentId)) {
      throw new Error('Access denied');
    }

    return this.feePaymentRepository.find({
      where: { studentId },
      order: { createdAt: 'DESC' }
    });
  }

  // Complaint Management
  async createComplaint(parentId: string, complaintData: any) {
    const complaint = this.complaintRepository.create({
      ...complaintData,
      parentId,
      status: 'open'
    });
    return this.complaintRepository.save(complaint);
  }

  async getComplaints(parentId: string) {
    return this.complaintRepository.find({
      where: { parentId },
      relations: ['student', 'student.user'],
      order: { createdAt: 'DESC' }
    });
  }

  async updateComplaint(complaintId: string, parentId: string, updateData: any) {
    const complaint = await this.complaintRepository.findOne({
      where: { id: complaintId, parentId }
    });

    if (!complaint) {
      throw new Error('Complaint not found');
    }

    await this.complaintRepository.update(complaintId, updateData);
    return this.complaintRepository.findOne({ where: { id: complaintId } });
  }

  // Child Progress Analytics
  async getChildProgress(studentId: string, parentId: string) {
    const parent = await this.parentRepository.findOne({
      where: { id: parentId },
      relations: ['children']
    });

    if (!parent.children.some(child => child.id === studentId)) {
      throw new Error('Access denied');
    }

    const grades = await this.gradeRepository.find({
      where: { studentId },
      order: { createdAt: 'DESC' }
    });

    const attendanceData = await this.attendanceRepository.find({
      where: { studentId },
      order: { date: 'DESC' },
      take: 30
    });

    const subjectPerformance = grades.reduce((acc, grade) => {
      if (!acc[grade.subject]) {
        acc[grade.subject] = { total: 0, count: 0, grades: [] };
      }
      acc[grade.subject].total += grade.percentage;
      acc[grade.subject].count += 1;
      acc[grade.subject].grades.push(grade);
      return acc;
    }, {});

    Object.keys(subjectPerformance).forEach(subject => {
      subjectPerformance[subject].average = 
        subjectPerformance[subject].total / subjectPerformance[subject].count;
    });

    return {
      overallAverage: grades.length > 0 ? 
        grades.reduce((sum, g) => sum + g.percentage, 0) / grades.length : 0,
      subjectPerformance,
      attendanceRate: attendanceData.length > 0 ? 
        (attendanceData.filter(a => a.status === 'present').length / attendanceData.length) * 100 : 0,
      recentTrend: grades.slice(0, 5).map(g => g.percentage)
    };
  }
}