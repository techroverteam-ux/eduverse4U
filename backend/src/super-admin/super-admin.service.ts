import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { School } from './entities/school.entity';
import { BillingRecord } from './entities/billing-record.entity';
import { PlatformSettings } from './entities/platform-settings.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class SuperAdminService {
  constructor(
    @InjectRepository(School)
    private schoolRepository: Repository<School>,
    @InjectRepository(BillingRecord)
    private billingRepository: Repository<BillingRecord>,
    @InjectRepository(PlatformSettings)
    private settingsRepository: Repository<PlatformSettings>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // Platform Analytics
  async getPlatformAnalytics() {
    const totalSchools = await this.schoolRepository.count();
    const activeSchools = await this.schoolRepository.count({ where: { status: 'Active' } });
    const totalUsers = await this.userRepository.count();
    
    const revenueResult = await this.billingRepository
      .createQueryBuilder('billing')
      .select('SUM(billing.amount)', 'totalRevenue')
      .where('billing.status = :status', { status: 'Paid' })
      .getRawOne();

    const monthlyRevenueResult = await this.billingRepository
      .createQueryBuilder('billing')
      .select('SUM(billing.amount)', 'monthlyRevenue')
      .where('billing.status = :status', { status: 'Paid' })
      .andWhere('billing.paidDate >= :startDate', { 
        startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1) 
      })
      .getRawOne();

    const usersByRole = await this.userRepository
      .createQueryBuilder('user')
      .select('user.role', 'role')
      .addSelect('COUNT(*)', 'count')
      .groupBy('user.role')
      .getRawMany();

    const revenueByPlan = await this.schoolRepository
      .createQueryBuilder('school')
      .select('school.plan', 'plan')
      .addSelect('COUNT(*)', 'schools')
      .addSelect('SUM(school.monthlyRevenue)', 'revenue')
      .groupBy('school.plan')
      .getRawMany();

    return {
      overview: {
        totalSchools,
        activeSchools,
        totalUsers,
        totalRevenue: parseFloat(revenueResult?.totalRevenue || '0'),
        monthlyRevenue: parseFloat(monthlyRevenueResult?.monthlyRevenue || '0'),
      },
      usersByRole,
      revenueByPlan,
    };
  }

  // Schools Management
  async getAllSchools(filters?: any) {
    const query = this.schoolRepository.createQueryBuilder('school');
    
    if (filters?.status) {
      query.andWhere('school.status = :status', { status: filters.status });
    }
    
    if (filters?.plan) {
      query.andWhere('school.plan = :plan', { plan: filters.plan });
    }
    
    if (filters?.search) {
      query.andWhere(
        '(school.name ILIKE :search OR school.location ILIKE :search OR school.principal ILIKE :search)',
        { search: `%${filters.search}%` }
      );
    }

    return await query.getMany();
  }

  async getSchoolById(id: string) {
    return await this.schoolRepository.findOne({
      where: { id },
      relations: ['users', 'billingRecords']
    });
  }

  async createSchool(schoolData: Partial<School>) {
    const school = this.schoolRepository.create(schoolData);
    return await this.schoolRepository.save(school);
  }

  async createSchoolRegistration(schoolData: any) {
    // Create tenant first
    const tenant = {
      name: schoolData.schoolName,
      subdomain: schoolData.subdomain,
      isActive: false // Will be activated after approval
    };

    // In a real implementation, you would:
    // 1. Create tenant record
    // 2. Create school registration record
    // 3. Send approval notification
    // 4. Generate registration receipt
    
    console.log('School registration received:', schoolData);
    
    return {
      success: true,
      message: 'School registration submitted successfully',
      registrationId: 'REG-' + Date.now(),
      status: 'pending_approval'
    };
  }

  async updateSchool(id: string, schoolData: Partial<School>) {
    await this.schoolRepository.update(id, schoolData);
    return await this.getSchoolById(id);
  }

  async deleteSchool(id: string) {
    return await this.schoolRepository.delete(id);
  }

  // Users Management
  async getAllUsers(filters?: any) {
    const query = this.userRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.school', 'school');
    
    if (filters?.role) {
      query.andWhere('user.role = :role', { role: filters.role });
    }
    
    if (filters?.status) {
      query.andWhere('user.status = :status', { status: filters.status });
    }
    
    if (filters?.schoolId) {
      query.andWhere('user.schoolId = :schoolId', { schoolId: filters.schoolId });
    }
    
    if (filters?.search) {
      query.andWhere(
        '(user.name ILIKE :search OR user.email ILIKE :search)',
        { search: `%${filters.search}%` }
      );
    }

    return await query.getMany();
  }

  async getUserById(id: string) {
    return await this.userRepository.findOne({
      where: { id },
      relations: ['school']
    });
  }

  async updateUserStatus(id: string, status: string) {
    await this.userRepository.update(id, { status });
    return await this.getUserById(id);
  }

  // Billing Management
  async getAllBillingRecords(filters?: any) {
    const query = this.billingRepository.createQueryBuilder('billing')
      .leftJoinAndSelect('billing.school', 'school');
    
    if (filters?.status) {
      query.andWhere('billing.status = :status', { status: filters.status });
    }
    
    if (filters?.plan) {
      query.andWhere('school.plan = :plan', { plan: filters.plan });
    }
    
    if (filters?.dateRange) {
      const { startDate, endDate } = filters.dateRange;
      query.andWhere('billing.dueDate BETWEEN :startDate AND :endDate', {
        startDate,
        endDate
      });
    }

    return await query.getMany();
  }

  async getBillingById(id: string) {
    return await this.billingRepository.findOne({
      where: { id },
      relations: ['school']
    });
  }

  async createBillingRecord(billingData: Partial<BillingRecord>) {
    const billing = this.billingRepository.create(billingData);
    return await this.billingRepository.save(billing);
  }

  async updateBillingStatus(id: string, status: string, paidDate?: Date) {
    const updateData: any = { status };
    if (paidDate) {
      updateData.paidDate = paidDate;
    }
    
    await this.billingRepository.update(id, updateData);
    return await this.getBillingById(id);
  }

  // Platform Settings
  async getSettings(category?: string) {
    const query = this.settingsRepository.createQueryBuilder('settings')
      .where('settings.isActive = :isActive', { isActive: true });
    
    if (category) {
      query.andWhere('settings.category = :category', { category });
    }

    return await query.getMany();
  }

  async updateSetting(key: string, value: string, category: string) {
    const existingSetting = await this.settingsRepository.findOne({
      where: { key, category }
    });

    if (existingSetting) {
      await this.settingsRepository.update(existingSetting.id, { value });
      return existingSetting;
    } else {
      const newSetting = this.settingsRepository.create({
        key,
        value,
        category,
        isActive: true
      });
      return await this.settingsRepository.save(newSetting);
    }
  }

  async updateMultipleSettings(settings: Array<{ key: string; value: string; category: string }>) {
    const results = [];
    for (const setting of settings) {
      const result = await this.updateSetting(setting.key, setting.value, setting.category);
      results.push(result);
    }
    return results;
  }

  // Revenue Analytics
  async getRevenueAnalytics(period: string = 'monthly') {
    let dateFormat = '%Y-%m';
    if (period === 'daily') dateFormat = '%Y-%m-%d';
    if (period === 'yearly') dateFormat = '%Y';

    const revenueData = await this.billingRepository
      .createQueryBuilder('billing')
      .select(`DATE_FORMAT(billing.paidDate, '${dateFormat}')`, 'period')
      .addSelect('SUM(billing.amount)', 'revenue')
      .addSelect('COUNT(*)', 'transactions')
      .where('billing.status = :status', { status: 'Paid' })
      .groupBy('period')
      .orderBy('period', 'ASC')
      .getRawMany();

    return revenueData;
  }

  // Geographic Analytics
  async getGeographicAnalytics() {
    return await this.schoolRepository
      .createQueryBuilder('school')
      .select('school.state', 'state')
      .addSelect('COUNT(*)', 'schools')
      .addSelect('SUM(school.students)', 'users')
      .addSelect('SUM(school.monthlyRevenue)', 'revenue')
      .groupBy('school.state')
      .orderBy('revenue', 'DESC')
      .getRawMany();
  }
}