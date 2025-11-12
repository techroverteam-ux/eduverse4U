import { Controller, Get, Post, Body, UseGuards, Request, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AttendanceService } from './attendance.service';

@Controller('attendance')
@UseGuards(JwtAuthGuard)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('mark')
  markAttendance(@Body() attendanceData: any, @Request() req) {
    return this.attendanceService.markAttendance(
      attendanceData,
      req.user.tenantId,
      req.user.userId
    );
  }

  @Get()
  getAttendance(@Request() req, @Query() filters) {
    return this.attendanceService.getAttendance(req.user.tenantId, filters);
  }

  @Get('summary')
  getAttendanceSummary(@Request() req, @Query('studentId') studentId: string) {
    return this.attendanceService.getAttendanceSummary(req.user.tenantId, studentId);
  }
}