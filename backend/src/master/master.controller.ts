import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MasterService } from './master.service';

@Controller('master')
export class MasterController {
  constructor(private readonly masterService: MasterService) {}

  // Academic Years
  @Get('academic-years')
  async getAcademicYears(@Query('schoolId') schoolId: string) {
    return await this.masterService.getAcademicYears(schoolId);
  }

  @Post('academic-years')
  async createAcademicYear(@Body() data: any) {
    return await this.masterService.createAcademicYear(data);
  }

  @Put('academic-years/:id')
  async updateAcademicYear(@Param('id') id: string, @Body() data: any) {
    return await this.masterService.updateAcademicYear(id, data);
  }

  @Delete('academic-years/:id')
  async deleteAcademicYear(@Param('id') id: string) {
    return await this.masterService.deleteAcademicYear(id);
  }

  // Classes
  @Get('classes')
  async getClasses(
    @Query('schoolId') schoolId: string,
    @Query('branchId') branchId?: string,
    @Query('academicYearId') academicYearId?: string
  ) {
    return await this.masterService.getClasses(schoolId, branchId, academicYearId);
  }

  @Post('classes')
  async createClass(@Body() data: any) {
    return await this.masterService.createClass(data);
  }

  @Put('classes/:id')
  async updateClass(@Param('id') id: string, @Body() data: any) {
    return await this.masterService.updateClass(id, data);
  }

  @Delete('classes/:id')
  async deleteClass(@Param('id') id: string) {
    return await this.masterService.deleteClass(id);
  }

  // Subjects
  @Get('subjects')
  async getSubjects(@Query('schoolId') schoolId: string) {
    return await this.masterService.getSubjects(schoolId);
  }

  @Post('subjects')
  async createSubject(@Body() data: any) {
    return await this.masterService.createSubject(data);
  }

  @Put('subjects/:id')
  async updateSubject(@Param('id') id: string, @Body() data: any) {
    return await this.masterService.updateSubject(id, data);
  }

  @Delete('subjects/:id')
  async deleteSubject(@Param('id') id: string) {
    return await this.masterService.deleteSubject(id);
  }

  // Class-Subject Mappings
  @Get('class-subject-mappings')
  async getClassSubjectMappings(
    @Query('schoolId') schoolId: string,
    @Query('classId') classId?: string
  ) {
    return await this.masterService.getClassSubjectMappings(schoolId, classId);
  }

  @Post('class-subject-mappings')
  async createClassSubjectMapping(@Body() data: any) {
    return await this.masterService.createClassSubjectMapping(data);
  }

  @Delete('class-subject-mappings/:id')
  async deleteClassSubjectMapping(@Param('id') id: string) {
    return await this.masterService.deleteClassSubjectMapping(id);
  }

  // Teachers
  @Get('teachers')
  async getTeachers(
    @Query('schoolId') schoolId: string,
    @Query('branchId') branchId?: string,
    @Query('search') search?: string
  ) {
    return await this.masterService.getTeachers(schoolId, branchId, search);
  }

  @Post('teachers')
  async createTeacher(@Body() data: any) {
    return await this.masterService.createTeacher(data);
  }

  @Put('teachers/:id')
  async updateTeacher(@Param('id') id: string, @Body() data: any) {
    return await this.masterService.updateTeacher(id, data);
  }

  @Delete('teachers/:id')
  async deleteTeacher(@Param('id') id: string) {
    return await this.masterService.deleteTeacher(id);
  }

  @Post('teachers/bulk-upload')
  @UseInterceptors(FileInterceptor('file'))
  async bulkUploadTeachers(@UploadedFile() file: Express.Multer.File, @Body('schoolId') schoolId: string) {
    return await this.masterService.bulkUploadTeachers(file, schoolId);
  }

  // Students
  @Get('students')
  async getStudents(
    @Query('schoolId') schoolId: string,
    @Query('branchId') branchId?: string,
    @Query('classId') classId?: string,
    @Query('search') search?: string
  ) {
    return await this.masterService.getStudents(schoolId, branchId, classId, search);
  }

  @Post('students')
  async createStudent(@Body() data: any) {
    return await this.masterService.createStudent(data);
  }

  @Put('students/:id')
  async updateStudent(@Param('id') id: string, @Body() data: any) {
    return await this.masterService.updateStudent(id, data);
  }

  @Delete('students/:id')
  async deleteStudent(@Param('id') id: string) {
    return await this.masterService.deleteStudent(id);
  }

  @Post('students/bulk-upload')
  @UseInterceptors(FileInterceptor('file'))
  async bulkUploadStudents(@UploadedFile() file: Express.Multer.File, @Body('schoolId') schoolId: string) {
    return await this.masterService.bulkUploadStudents(file, schoolId);
  }

  // Fee Structures
  @Get('fee-structures')
  async getFeeStructures(
    @Query('schoolId') schoolId: string,
    @Query('classId') classId?: string,
    @Query('academicYearId') academicYearId?: string
  ) {
    return await this.masterService.getFeeStructures(schoolId, classId, academicYearId);
  }

  @Post('fee-structures')
  async createFeeStructure(@Body() data: any) {
    return await this.masterService.createFeeStructure(data);
  }

  @Put('fee-structures/:id')
  async updateFeeStructure(@Param('id') id: string, @Body() data: any) {
    return await this.masterService.updateFeeStructure(id, data);
  }

  @Delete('fee-structures/:id')
  async deleteFeeStructure(@Param('id') id: string) {
    return await this.masterService.deleteFeeStructure(id);
  }

  // Time Tables
  @Get('time-tables')
  async getTimeTables(
    @Query('schoolId') schoolId: string,
    @Query('classId') classId?: string,
    @Query('teacherId') teacherId?: string
  ) {
    return await this.masterService.getTimeTables(schoolId, classId, teacherId);
  }

  @Post('time-tables')
  async createTimeTable(@Body() data: any) {
    return await this.masterService.createTimeTable(data);
  }

  @Put('time-tables/:id')
  async updateTimeTable(@Param('id') id: string, @Body() data: any) {
    return await this.masterService.updateTimeTable(id, data);
  }

  @Delete('time-tables/:id')
  async deleteTimeTable(@Param('id') id: string) {
    return await this.masterService.deleteTimeTable(id);
  }

  // Templates
  @Get('templates/teachers')
  async getTeachersTemplate() {
    return await this.masterService.getTeachersTemplate();
  }

  @Get('templates/students')
  async getStudentsTemplate() {
    return await this.masterService.getStudentsTemplate();
  }
}