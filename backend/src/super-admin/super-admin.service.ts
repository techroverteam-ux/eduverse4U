import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { School } from './entities/school.entity';
import { BillingRecord } from './entities/billing-record.entity';
import { PlatformSettings } from './entities/platform-settings.entity';
import { SubscriptionPlan } from './entities/subscription-plan.entity';
import { SchoolBranch } from './entities/school-branch.entity';
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
    @InjectRepository(SubscriptionPlan)
    private subscriptionPlanRepository: Repository<SubscriptionPlan>,
    @InjectRepository(SchoolBranch)
    private schoolBranchRepository: Repository<SchoolBranch>,
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
      .select('school.selectedPackage', 'plan')
      .addSelect('COUNT(*)', 'schools')
      .addSelect('SUM(school.monthlyRevenue)', 'revenue')
      .groupBy('school.selectedPackage')
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
      query.andWhere('school.selectedPackage = :plan', { plan: filters.plan });
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
    try {
      // Create comprehensive school record
      const school = this.schoolRepository.create({
        name: schoolData.schoolName,
        schoolCode: schoolData.schoolCode,
        registrationNumber: schoolData.registrationNumber,
        affiliationNumber: schoolData.affiliationNumber,
        establishedYear: schoolData.establishedYear,
        schoolType: schoolData.schoolType,
        board: schoolData.affiliationBoard || schoolData.board,
        
        // Address
        location: `${schoolData.city}, ${schoolData.state}`,
        city: schoolData.city,
        state: schoolData.state,
        pincode: schoolData.pincode,
        district: schoolData.district,
        country: schoolData.country || 'India',
        
        // Contact
        email: schoolData.contactEmail || schoolData.principalEmail,
        phone: schoolData.contactPhone || schoolData.principalPhone,
        website: schoolData.website,
        
        // Principal
        principal: schoolData.principalName,
        principalEmail: schoolData.principalEmail,
        principalPhone: schoolData.principalPhone,
        principalQualification: schoolData.principalQualification,
        principalExperience: schoolData.principalExperience,
        
        // Admin
        adminName: schoolData.adminName,
        adminEmail: schoolData.adminEmail,
        adminPhone: schoolData.adminPhone,
        
        // Academic
        mediumOfInstruction: schoolData.mediumOfInstruction || [],
        classesOffered: schoolData.classesOffered || [],
        
        // Statistics
        students: schoolData.totalStudents || 0,
        teachers: schoolData.totalTeachers || 0,
        totalStaff: schoolData.totalStaff || 0,
        totalClassrooms: schoolData.totalClassrooms || 0,
        
        // Infrastructure
        hasLibrary: schoolData.hasLibrary || false,
        hasLaboratory: schoolData.hasLaboratory || false,
        hasComputerLab: schoolData.hasComputerLab || false,
        hasPlayground: schoolData.hasPlayground || false,
        hasAuditorium: schoolData.hasAuditorium || false,
        hasMedicalRoom: schoolData.hasMedicalRoom || false,
        hasCanteen: schoolData.hasCanteen || false,
        hasTransport: schoolData.hasTransport || false,
        
        // Business
        selectedPackage: schoolData.selectedPackage,
        status: 'Pending',
        monthlyRevenue: 0
      });

      const savedSchool = await this.schoolRepository.save(school);
      
      // Save branches if provided
      if (schoolData.branches && schoolData.branches.length > 0) {
        const branches = schoolData.branches.map((branch, index) => 
          this.schoolBranchRepository.create({
            schoolId: savedSchool.id,
            name: branch.branchName || `Branch ${index + 1}`,
            branchCode: branch.branchCode || `BR${index + 1}`,
            address: branch.address || schoolData.addressLine1,
            city: branch.city || schoolData.city,
            state: branch.state || schoolData.state,
            pincode: branch.pincode || schoolData.pincode,
            phone: branch.phone || schoolData.contactPhone,
            email: branch.email || schoolData.contactEmail,
            branchManager: branch.branchManager || schoolData.principalName,
            managerPhone: branch.managerPhone || schoolData.principalPhone,
            managerEmail: branch.managerEmail || schoolData.principalEmail,
            students: branch.students || 0,
            teachers: branch.teachers || 0,
            classrooms: branch.classrooms || 0,
            status: 'Active',
            isMainBranch: index === 0
          })
        );
        
        await this.schoolBranchRepository.save(branches);
        console.log(`Saved ${branches.length} branches for school:`, savedSchool.id);
      }
      
      console.log('School registration saved:', savedSchool.id);
      
      return {
        success: true,
        message: 'School registration submitted successfully',
        registrationId: `REG-${savedSchool.id.substring(0, 8).toUpperCase()}`,
        schoolId: savedSchool.id,
        status: 'pending_approval'
      };
    } catch (error) {
      console.error('School registration failed:', error);
      throw new Error('Failed to register school: ' + error.message);
    }
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
      query.andWhere('school.selectedPackage = :plan', { plan: filters.plan });
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

  // Subscription Plans Management
  async getAllSubscriptionPlans() {
    return await this.subscriptionPlanRepository.find({
      where: { isActive: true },
      order: { sortOrder: 'ASC' }
    });
  }

  async createSubscriptionPlan(planData: Partial<SubscriptionPlan>) {
    const plan = this.subscriptionPlanRepository.create(planData);
    return await this.subscriptionPlanRepository.save(plan);
  }

  async updateSubscriptionPlan(id: string, planData: Partial<SubscriptionPlan>) {
    await this.subscriptionPlanRepository.update(id, planData);
    return await this.subscriptionPlanRepository.findOne({ where: { id } });
  }

  // School Branches Management
  async getSchoolBranches(schoolId: string) {
    return await this.schoolBranchRepository.find({
      where: { schoolId },
      order: { isMainBranch: 'DESC', createdAt: 'ASC' }
    });
  }

  async createSchoolBranches(schoolId: string, branches: Partial<SchoolBranch>[]) {
    const branchEntities = branches.map(branch => 
      this.schoolBranchRepository.create({ ...branch, schoolId })
    );
    return await this.schoolBranchRepository.save(branchEntities);
  }

  async updateSchoolBranch(id: string, branchData: Partial<SchoolBranch>) {
    await this.schoolBranchRepository.update(id, branchData);
    return await this.schoolBranchRepository.findOne({ where: { id } });
  }

  async deleteSchoolBranch(id: string) {
    return await this.schoolBranchRepository.delete(id);
  }

  // Get All Branches
  async getAllBranches(filters?: any) {
    try {
      const branches = await this.schoolBranchRepository.find({
        relations: ['school']
      });
      
      if (branches.length === 0) {
        // Return mock data if no branches found
        return [
          {
            id: '1',
            schoolId: 'school1',
            schoolName: 'Delhi Public School',
            name: 'Main Campus',
            address: '123 Main Street',
            city: 'Delhi',
            state: 'Delhi',
            principal: 'Dr. Sharma',
            email: 'main@dps.edu',
            phone: '+91-9876543210',
            students: 1200,
            teachers: 45,
            status: 'Active'
          },
          {
            id: '2',
            schoolId: 'school1',
            schoolName: 'Delhi Public School',
            name: 'East Branch',
            address: '456 East Avenue',
            city: 'Delhi',
            state: 'Delhi',
            principal: 'Mrs. Gupta',
            email: 'east@dps.edu',
            phone: '+91-9876543211',
            students: 800,
            teachers: 32,
            status: 'Active'
          }
        ];
      }
      
      return branches.map(branch => ({
        id: branch.id,
        schoolId: branch.schoolId,
        schoolName: branch.school?.name || 'Unknown School',
        name: branch.name,
        address: branch.address,
        city: branch.city,
        state: branch.state,
        principal: branch.branchManager || 'Not Assigned',
        email: branch.email,
        phone: branch.phone,
        students: branch.students || 0,
        teachers: branch.teachers || 0,
        status: branch.status || 'Active'
      }));
    } catch (error) {
      console.error('Error fetching branches:', error);
      return [];
    }
  }
}