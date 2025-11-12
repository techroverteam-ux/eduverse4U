import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { SuperAdminService } from './super-admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CreateSchoolDto } from './dto/create-school.dto';

@Controller('super-admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('super_admin')
export class SuperAdminController {
  constructor(private readonly superAdminService: SuperAdminService) {}

  // Platform Analytics Endpoints
  @Get('analytics')
  async getPlatformAnalytics() {
    return await this.superAdminService.getPlatformAnalytics();
  }

  @Get('analytics/revenue')
  async getRevenueAnalytics(@Query('period') period?: string) {
    return await this.superAdminService.getRevenueAnalytics(period);
  }

  @Get('analytics/geographic')
  async getGeographicAnalytics() {
    return await this.superAdminService.getGeographicAnalytics();
  }

  // Schools Management Endpoints
  @Get('schools')
  async getAllSchools(
    @Query('status') status?: string,
    @Query('plan') plan?: string,
    @Query('search') search?: string,
  ) {
    const filters = { status, plan, search };
    return await this.superAdminService.getAllSchools(filters);
  }

  @Get('schools/:id')
  async getSchoolById(@Param('id') id: string) {
    return await this.superAdminService.getSchoolById(id);
  }

  @Post('schools')
  async createSchool(@Body() schoolData: CreateSchoolDto) {
    return await this.superAdminService.createSchoolRegistration(schoolData);
  }

  @Put('schools/:id')
  async updateSchool(@Param('id') id: string, @Body() schoolData: any) {
    return await this.superAdminService.updateSchool(id, schoolData);
  }

  @Delete('schools/:id')
  async deleteSchool(@Param('id') id: string) {
    return await this.superAdminService.deleteSchool(id);
  }

  // Users Management Endpoints
  @Get('users')
  async getAllUsers(
    @Query('role') role?: string,
    @Query('status') status?: string,
    @Query('schoolId') schoolId?: string,
    @Query('search') search?: string,
  ) {
    const filters = { role, status, schoolId, search };
    return await this.superAdminService.getAllUsers(filters);
  }

  @Get('users/:id')
  async getUserById(@Param('id') id: string) {
    return await this.superAdminService.getUserById(id);
  }

  @Put('users/:id/status')
  async updateUserStatus(@Param('id') id: string, @Body('status') status: string) {
    return await this.superAdminService.updateUserStatus(id, status);
  }

  // Billing Management Endpoints
  @Get('billing')
  async getAllBillingRecords(
    @Query('status') status?: string,
    @Query('plan') plan?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const filters: any = { status, plan };
    if (startDate && endDate) {
      filters.dateRange = { startDate, endDate };
    }
    return await this.superAdminService.getAllBillingRecords(filters);
  }

  @Get('billing/:id')
  async getBillingById(@Param('id') id: string) {
    return await this.superAdminService.getBillingById(id);
  }

  @Post('billing')
  async createBillingRecord(@Body() billingData: any) {
    return await this.superAdminService.createBillingRecord(billingData);
  }

  @Put('billing/:id/status')
  async updateBillingStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @Body('paidDate') paidDate?: Date,
  ) {
    return await this.superAdminService.updateBillingStatus(id, status, paidDate);
  }

  // Platform Settings Endpoints
  @Get('settings')
  async getSettings(@Query('category') category?: string) {
    return await this.superAdminService.getSettings(category);
  }

  @Put('settings')
  async updateSettings(@Body() settings: Array<{ key: string; value: string; category: string }>) {
    return await this.superAdminService.updateMultipleSettings(settings);
  }

  @Put('settings/:key')
  async updateSetting(
    @Param('key') key: string,
    @Body('value') value: string,
    @Body('category') category: string,
  ) {
    return await this.superAdminService.updateSetting(key, value, category);
  }

  // Dashboard Overview
  @Get('dashboard')
  async getDashboardOverview() {
    const analytics = await this.superAdminService.getPlatformAnalytics();
    const recentSchools = await this.superAdminService.getAllSchools();
    const recentBilling = await this.superAdminService.getAllBillingRecords();
    
    return {
      analytics,
      recentSchools: recentSchools.slice(0, 5),
      recentBilling: recentBilling.slice(0, 5),
    };
  }

  // System Health Check
  @Get('health')
  async getSystemHealth() {
    // Basic system health metrics
    return {
      status: 'healthy',
      timestamp: new Date(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.version,
    };
  }

  // Export Data
  @Get('export/schools')
  async exportSchools(@Query('format') format: string = 'json') {
    const schools = await this.superAdminService.getAllSchools();
    return {
      data: schools,
      format,
      exportedAt: new Date(),
      count: schools.length,
    };
  }

  @Get('export/users')
  async exportUsers(@Query('format') format: string = 'json') {
    const users = await this.superAdminService.getAllUsers();
    return {
      data: users,
      format,
      exportedAt: new Date(),
      count: users.length,
    };
  }

  @Get('export/billing')
  async exportBilling(@Query('format') format: string = 'json') {
    const billing = await this.superAdminService.getAllBillingRecords();
    return {
      data: billing,
      format,
      exportedAt: new Date(),
      count: billing.length,
    };
  }
}