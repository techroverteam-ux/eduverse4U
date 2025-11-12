import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance } from './entities/attendance.entity';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
  ) {}

  async markAttendance(attendanceData: any, tenantId: string, userId: string) {
    const records = attendanceData.attendance.map(record => ({
      ...record,
      tenantId,
      markedById: userId,
      date: new Date(attendanceData.date),
    }));

    // Delete existing records for the date
    await this.attendanceRepository.delete({
      tenantId,
      date: new Date(attendanceData.date),
    });

    return this.attendanceRepository.save(records);
  }

  async getAttendance(tenantId: string, filters: any = {}) {
    const where: any = { tenantId };
    if (filters.studentId) where.studentId = filters.studentId;
    if (filters.date) where.date = new Date(filters.date);

    return this.attendanceRepository.find({
      where,
      relations: ['student'],
      order: { date: 'DESC' },
    });
  }

  async getAttendanceSummary(tenantId: string, studentId?: string) {
    const query = this.attendanceRepository
      .createQueryBuilder('attendance')
      .select([
        'COUNT(*) as total_days',
        'SUM(CASE WHEN status = \'present\' THEN 1 ELSE 0 END) as present_days',
        'SUM(CASE WHEN status = \'absent\' THEN 1 ELSE 0 END) as absent_days',
      ])
      .where('attendance.tenantId = :tenantId', { tenantId });

    if (studentId) {
      query.andWhere('attendance.studentId = :studentId', { studentId });
    }

    return query.getRawOne();
  }
}