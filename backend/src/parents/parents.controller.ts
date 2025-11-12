import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ParentsService } from './parents.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('parents')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('parent')
export class ParentsController {
  constructor(private readonly parentsService: ParentsService) {}

  @Get('dashboard')
  async getParentDashboard(@Request() req) {
    const parent = await this.parentsService.findByUserId(req.user.id);
    return this.parentsService.getParentDashboard(parent.id);
  }

  @Get('children/:studentId/grades')
  async getChildGrades(@Param('studentId') studentId: string, @Request() req) {
    const parent = await this.parentsService.findByUserId(req.user.id);
    return this.parentsService.getChildGrades(studentId, parent.id);
  }

  @Get('children/:studentId/attendance')
  async getChildAttendance(
    @Param('studentId') studentId: string, 
    @Query() filters: any,
    @Request() req
  ) {
    const parent = await this.parentsService.findByUserId(req.user.id);
    return this.parentsService.getChildAttendance(studentId, parent.id, filters);
  }

  @Get('children/:studentId/fees')
  async getChildFees(@Param('studentId') studentId: string, @Request() req) {
    const parent = await this.parentsService.findByUserId(req.user.id);
    return this.parentsService.getChildFees(studentId, parent.id);
  }

  @Get('children/:studentId/progress')
  async getChildProgress(@Param('studentId') studentId: string, @Request() req) {
    const parent = await this.parentsService.findByUserId(req.user.id);
    return this.parentsService.getChildProgress(studentId, parent.id);
  }

  @Get('complaints')
  async getComplaints(@Request() req) {
    const parent = await this.parentsService.findByUserId(req.user.id);
    return this.parentsService.getComplaints(parent.id);
  }

  @Post('complaints')
  async createComplaint(@Body() complaintData: any, @Request() req) {
    const parent = await this.parentsService.findByUserId(req.user.id);
    return this.parentsService.createComplaint(parent.id, complaintData);
  }

  @Put('complaints/:id')
  async updateComplaint(
    @Param('id') complaintId: string,
    @Body() updateData: any,
    @Request() req
  ) {
    const parent = await this.parentsService.findByUserId(req.user.id);
    return this.parentsService.updateComplaint(complaintId, parent.id, updateData);
  }
}