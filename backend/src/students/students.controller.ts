import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { StudentsService } from './students.service';

@Controller('students')
@UseGuards(JwtAuthGuard)
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  create(@Body() createStudentDto: any, @Request() req) {
    return this.studentsService.create(createStudentDto, req.user.tenantId);
  }

  @Get()
  findAll(@Request() req, @Query() query) {
    return this.studentsService.findAll(req.user.tenantId, query);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.studentsService.findOne(id, req.user.tenantId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStudentDto: any, @Request() req) {
    return this.studentsService.update(id, updateStudentDto, req.user.tenantId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.studentsService.remove(id, req.user.tenantId);
  }

  @Get('dashboard/:studentId')
  getStudentDashboard(@Param('studentId') studentId: string) {
    return this.studentsService.getStudentDashboard(studentId);
  }

  @Get('grades/:studentId')
  getStudentGrades(@Param('studentId') studentId: string, @Query() filters: any) {
    return this.studentsService.getStudentGrades(studentId, filters);
  }

  @Get('attendance/:studentId')
  getStudentAttendance(@Param('studentId') studentId: string, @Query() filters: any) {
    return this.studentsService.getStudentAttendance(studentId, filters);
  }

  @Get('fees/:studentId')
  getStudentFees(@Param('studentId') studentId: string) {
    return this.studentsService.getStudentFees(studentId);
  }

  @Get('profile/me')
  async getMyProfile(@Request() req) {
    const student = await this.studentsService.findByUserId(req.user.id);
    return this.studentsService.getStudentDashboard(student.id);
  }
}