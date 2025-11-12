import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AcademicYear } from './entities/academic-year.entity';
import { Class } from './entities/class.entity';
import { Subject } from './entities/subject.entity';
import { ClassSubjectMapping } from './entities/class-subject-mapping.entity';
import { Teacher } from './entities/teacher.entity';
import { Student } from './entities/student.entity';
import { FeeStructure } from './entities/fee-structure.entity';
import { TimeTable } from './entities/time-table.entity';
import * as XLSX from 'xlsx';

@Injectable()
export class MasterService {
  constructor(
    @InjectRepository(AcademicYear)
    private academicYearRepository: Repository<AcademicYear>,
    @InjectRepository(Class)
    private classRepository: Repository<Class>,
    @InjectRepository(Subject)
    private subjectRepository: Repository<Subject>,
    @InjectRepository(ClassSubjectMapping)
    private classSubjectMappingRepository: Repository<ClassSubjectMapping>,
    @InjectRepository(Teacher)
    private teacherRepository: Repository<Teacher>,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    @InjectRepository(FeeStructure)
    private feeStructureRepository: Repository<FeeStructure>,
    @InjectRepository(TimeTable)
    private timeTableRepository: Repository<TimeTable>,
  ) {}

  // Academic Years
  async getAcademicYears(schoolId: string) {
    try {
      const academicYears = await this.academicYearRepository.find({
        where: { schoolId },
        order: { startDate: 'DESC' }
      });

      // If no academic years exist, create sample data
      if (academicYears.length === 0) {
        await this.seedAcademicYears(schoolId);
        return await this.academicYearRepository.find({
          where: { schoolId },
          order: { startDate: 'DESC' }
        });
      }

      return academicYears.map(ay => ({
        id: ay.id,
        name: ay.name,
        startDate: ay.startDate,
        endDate: ay.endDate,
        isActive: ay.isActive,
        isCurrent: ay.isCurrent,
        schoolId: ay.schoolId,
        schoolName: 'Demo School' // This should come from school entity
      }));
    } catch (error) {
      console.error('Error fetching academic years:', error);
      return [];
    }
  }

  async createAcademicYear(data: any) {
    const academicYear = this.academicYearRepository.create(data);
    return await this.academicYearRepository.save(academicYear);
  }

  async updateAcademicYear(id: string, data: any) {
    await this.academicYearRepository.update(id, data);
    return await this.academicYearRepository.findOne({ where: { id } });
  }

  async deleteAcademicYear(id: string) {
    return await this.academicYearRepository.delete(id);
  }

  // Classes
  async getClasses(schoolId: string, branchId?: string, academicYearId?: string) {
    try {
      let classes = await this.classRepository.find({
        where: { schoolId },
        order: { name: 'ASC' }
      });

      // If no classes exist, create sample data
      if (classes.length === 0) {
        await this.seedClasses(schoolId);
        classes = await this.classRepository.find({
          where: { schoolId },
          order: { name: 'ASC' }
        });
      }

      return classes.map(cls => ({
        id: cls.id,
        name: cls.name,
        section: cls.section,
        schoolId: cls.schoolId,
        branchId: cls.branchId,
        academicYearId: cls.academicYearId,
        capacity: cls.capacity,
        currentStrength: cls.currentStrength
      }));
    } catch (error) {
      console.error('Error fetching classes:', error);
      return [];
    }
  }

  async createClass(data: any) {
    const classEntity = this.classRepository.create(data);
    return await this.classRepository.save(classEntity);
  }

  async updateClass(id: string, data: any) {
    await this.classRepository.update(id, data);
    return await this.classRepository.findOne({ where: { id } });
  }

  async deleteClass(id: string) {
    return await this.classRepository.delete(id);
  }

  // Subjects
  async getSubjects(schoolId: string) {
    try {
      let subjects = await this.subjectRepository.find({
        where: { schoolId },
        order: { name: 'ASC' }
      });

      // If no subjects exist, create sample data
      if (subjects.length === 0) {
        await this.seedSubjects(schoolId);
        subjects = await this.subjectRepository.find({
          where: { schoolId },
          order: { name: 'ASC' }
        });
      }

      return subjects;
    } catch (error) {
      console.error('Error fetching subjects:', error);
      return [];
    }
  }

  async createSubject(data: any) {
    const subject = this.subjectRepository.create(data);
    return await this.subjectRepository.save(subject);
  }

  async updateSubject(id: string, data: any) {
    await this.subjectRepository.update(id, data);
    return await this.subjectRepository.findOne({ where: { id } });
  }

  async deleteSubject(id: string) {
    return await this.subjectRepository.delete(id);
  }

  // Teachers
  async getTeachers(schoolId: string, branchId?: string, search?: string) {
    try {
      let query = this.teacherRepository.createQueryBuilder('teacher')
        .where('teacher.schoolId = :schoolId', { schoolId });

      if (branchId) {
        query.andWhere('teacher.branchId = :branchId', { branchId });
      }

      if (search) {
        query.andWhere(
          '(teacher.firstName ILIKE :search OR teacher.lastName ILIKE :search OR teacher.email ILIKE :search)',
          { search: `%${search}%` }
        );
      }

      let teachers = await query.getMany();

      // If no teachers exist, create sample data
      if (teachers.length === 0 && !search) {
        await this.seedTeachers(schoolId);
        teachers = await query.getMany();
      }

      return teachers.map(teacher => ({
        id: teacher.id,
        employeeId: teacher.employeeId,
        firstName: teacher.firstName,
        lastName: teacher.lastName,
        email: teacher.email,
        phone: teacher.phone,
        dateOfBirth: teacher.dateOfBirth,
        gender: teacher.gender,
        address: teacher.address,
        qualification: teacher.qualification,
        experience: teacher.experience,
        joiningDate: teacher.joiningDate,
        salary: teacher.salary,
        subjects: teacher.subjects,
        schoolId: teacher.schoolId,
        branchId: teacher.branchId,
        status: teacher.status || 'Active',
        branchName: 'Main Branch', // This should come from branch entity
        schoolName: 'Demo School' // This should come from school entity
      }));
    } catch (error) {
      console.error('Error fetching teachers:', error);
      return [];
    }
  }

  async createTeacher(data: any) {
    const teacher = this.teacherRepository.create(data);
    return await this.teacherRepository.save(teacher);
  }

  async updateTeacher(id: string, data: any) {
    await this.teacherRepository.update(id, data);
    return await this.teacherRepository.findOne({ where: { id } });
  }

  async deleteTeacher(id: string) {
    return await this.teacherRepository.delete(id);
  }

  // Students
  async getStudents(schoolId: string, branchId?: string, classId?: string, search?: string) {
    try {
      let query = this.studentRepository.createQueryBuilder('student')
        .where('student.schoolId = :schoolId', { schoolId });

      if (branchId) {
        query.andWhere('student.branchId = :branchId', { branchId });
      }

      if (classId) {
        query.andWhere('student.classId = :classId', { classId });
      }

      if (search) {
        query.andWhere(
          '(student.firstName ILIKE :search OR student.lastName ILIKE :search OR student.rollNumber ILIKE :search)',
          { search: `%${search}%` }
        );
      }

      let students = await query.getMany();

      // If no students exist, create sample data
      if (students.length === 0 && !search) {
        await this.seedStudents(schoolId);
        students = await query.getMany();
      }

      return students.map(student => ({
        id: student.id,
        rollNumber: student.rollNumber,
        admissionNumber: student.admissionNumber,
        firstName: student.firstName,
        lastName: student.lastName,
        dateOfBirth: student.dateOfBirth,
        gender: student.gender,
        fatherName: student.fatherName,
        motherName: student.motherName,
        parentPhone: student.parentPhone,
        parentEmail: student.parentEmail,
        address: student.address,
        admissionDate: student.admissionDate,
        classId: student.classId,
        className: 'Class 10-A', // This should come from class entity
        academicYearId: student.academicYearId,
        academicYearName: '2023-24', // This should come from academic year entity
        branchId: student.branchId,
        branchName: 'Main Branch', // This should come from branch entity
        schoolId: student.schoolId,
        schoolName: 'Demo School', // This should come from school entity
        status: student.status || 'Active',
        bloodGroup: student.bloodGroup,
        religion: student.religion,
        caste: student.caste,
        category: student.category,
        aadharNumber: student.aadharNumber,
        previousSchool: student.previousSchool,
        transportRequired: student.transportRequired,
        hostelRequired: student.hostelRequired,
        medicalConditions: student.medicalConditions,
        emergencyContact: student.emergencyContact,
        guardianName: student.guardianName,
        guardianPhone: student.guardianPhone,
        guardianRelation: student.guardianRelation
      }));
    } catch (error) {
      console.error('Error fetching students:', error);
      return [];
    }
  }

  async createStudent(data: any) {
    const student = this.studentRepository.create(data);
    return await this.studentRepository.save(student);
  }

  async updateStudent(id: string, data: any) {
    await this.studentRepository.update(id, data);
    return await this.studentRepository.findOne({ where: { id } });
  }

  async deleteStudent(id: string) {
    return await this.studentRepository.delete(id);
  }

  // Fee Structures
  async getFeeStructures(schoolId: string, classId?: string, academicYearId?: string) {
    try {
      let query = this.feeStructureRepository.createQueryBuilder('fee')
        .where('fee.schoolId = :schoolId', { schoolId });

      if (classId) {
        query.andWhere('fee.classId = :classId', { classId });
      }

      if (academicYearId) {
        query.andWhere('fee.academicYearId = :academicYearId', { academicYearId });
      }

      let feeStructures = await query.getMany();

      // If no fee structures exist, create sample data
      if (feeStructures.length === 0) {
        await this.seedFeeStructures(schoolId);
        feeStructures = await query.getMany();
      }

      return feeStructures.map(fee => ({
        id: fee.id,
        feeName: fee.feeName,
        amount: fee.amount,
        frequency: fee.frequency,
        category: fee.category,
        className: 'Class 10-A', // This should come from class entity
        academicYear: '2023-24', // This should come from academic year entity
        isOptional: fee.isOptional,
        dueDate: fee.dueDate,
        schoolId: fee.schoolId,
        classId: fee.classId,
        academicYearId: fee.academicYearId
      }));
    } catch (error) {
      console.error('Error fetching fee structures:', error);
      return [];
    }
  }

  async createFeeStructure(data: any) {
    const feeStructure = this.feeStructureRepository.create(data);
    return await this.feeStructureRepository.save(feeStructure);
  }

  async updateFeeStructure(id: string, data: any) {
    await this.feeStructureRepository.update(id, data);
    return await this.feeStructureRepository.findOne({ where: { id } });
  }

  async deleteFeeStructure(id: string) {
    return await this.feeStructureRepository.delete(id);
  }

  // Bulk Upload Methods
  async bulkUploadTeachers(file: Express.Multer.File, schoolId: string) {
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet);

    const teachers = data.map((row: any) => 
      this.teacherRepository.create({
        schoolId,
        employeeId: row.employeeId,
        firstName: row.firstName,
        lastName: row.lastName,
        email: row.email,
        phone: row.phone,
        dateOfBirth: new Date(row.dateOfBirth),
        gender: row.gender,
        address: row.address,
        qualification: row.qualification,
        experience: row.experience,
        joiningDate: new Date(row.joiningDate),
        salary: row.salary,
        subjects: row.subjects ? row.subjects.split(',') : [],
        branchId: row.branchId
      })
    );

    return await this.teacherRepository.save(teachers);
  }

  async bulkUploadStudents(file: Express.Multer.File, schoolId: string) {
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet);

    const students = data.map((row: any) => 
      this.studentRepository.create({
        schoolId,
        rollNumber: row.rollNumber,
        admissionNumber: row.admissionNumber,
        firstName: row.firstName,
        lastName: row.lastName,
        dateOfBirth: new Date(row.dateOfBirth),
        gender: row.gender,
        fatherName: row.fatherName,
        motherName: row.motherName,
        parentPhone: row.parentPhone,
        parentEmail: row.parentEmail,
        address: row.address,
        admissionDate: new Date(row.admissionDate),
        classId: row.classId,
        academicYearId: row.academicYearId,
        branchId: row.branchId
      })
    );

    return await this.studentRepository.save(students);
  }

  // Template Methods
  async getTeachersTemplate() {
    const template = [
      {
        employeeId: 'EMP001',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@school.edu',
        phone: '+91-9876543210',
        dateOfBirth: '1985-01-15',
        gender: 'Male',
        address: '123 Main Street, City',
        qualification: 'M.Sc Mathematics',
        experience: '5 years',
        joiningDate: '2023-01-01',
        salary: 50000,
        subjects: 'Mathematics,Physics',
        branchId: 'branch-id-here'
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(template);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Teachers');
    
    return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  }

  async getStudentsTemplate() {
    const template = [
      {
        rollNumber: '001',
        admissionNumber: 'ADM2023001',
        firstName: 'Jane',
        lastName: 'Smith',
        dateOfBirth: '2010-05-20',
        gender: 'Female',
        fatherName: 'Robert Smith',
        motherName: 'Mary Smith',
        parentPhone: '+91-9876543211',
        parentEmail: 'parent@email.com',
        address: '456 School Street, City',
        admissionDate: '2023-04-01',
        classId: 'class-id-here',
        academicYearId: 'academic-year-id-here',
        branchId: 'branch-id-here'
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(template);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');
    
    return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  }

  // Seeding Methods
  private async seedAcademicYears(schoolId: string) {
    const academicYears = [
      {
        name: '2023-24',
        startDate: new Date('2023-04-01'),
        endDate: new Date('2024-03-31'),
        isActive: true,
        isCurrent: true,
        schoolId
      },
      {
        name: '2024-25',
        startDate: new Date('2024-04-01'),
        endDate: new Date('2025-03-31'),
        isActive: false,
        isCurrent: false,
        schoolId
      },
      {
        name: '2022-23',
        startDate: new Date('2022-04-01'),
        endDate: new Date('2023-03-31'),
        isActive: false,
        isCurrent: false,
        schoolId
      }
    ];

    for (const ay of academicYears) {
      const existing = await this.academicYearRepository.findOne({
        where: { name: ay.name, schoolId }
      });
      if (!existing) {
        await this.academicYearRepository.save(this.academicYearRepository.create(ay));
      }
    }
  }

  private async seedClasses(schoolId: string) {
    const classes = [
      { name: 'Class 1', section: 'A', capacity: 30, currentStrength: 25, schoolId },
      { name: 'Class 1', section: 'B', capacity: 30, currentStrength: 28, schoolId },
      { name: 'Class 2', section: 'A', capacity: 30, currentStrength: 27, schoolId },
      { name: 'Class 3', section: 'A', capacity: 30, currentStrength: 29, schoolId },
      { name: 'Class 4', section: 'A', capacity: 30, currentStrength: 26, schoolId },
      { name: 'Class 5', section: 'A', capacity: 30, currentStrength: 24, schoolId },
      { name: 'Class 6', section: 'A', capacity: 35, currentStrength: 32, schoolId },
      { name: 'Class 7', section: 'A', capacity: 35, currentStrength: 30, schoolId },
      { name: 'Class 8', section: 'A', capacity: 35, currentStrength: 33, schoolId },
      { name: 'Class 9', section: 'A', capacity: 40, currentStrength: 38, schoolId },
      { name: 'Class 10', section: 'A', capacity: 40, currentStrength: 35, schoolId },
      { name: 'Class 11', section: 'Science', capacity: 30, currentStrength: 28, schoolId },
      { name: 'Class 11', section: 'Commerce', capacity: 30, currentStrength: 25, schoolId },
      { name: 'Class 12', section: 'Science', capacity: 30, currentStrength: 27, schoolId },
      { name: 'Class 12', section: 'Commerce', capacity: 30, currentStrength: 23, schoolId }
    ];

    for (const cls of classes) {
      const existing = await this.classRepository.findOne({
        where: { name: cls.name, section: cls.section, schoolId }
      });
      if (!existing) {
        await this.classRepository.save(this.classRepository.create(cls));
      }
    }
  }

  private async seedSubjects(schoolId: string) {
    const subjects = [
      { name: 'Mathematics', code: 'MATH', description: 'Mathematics subject', schoolId },
      { name: 'English', code: 'ENG', description: 'English Language', schoolId },
      { name: 'Hindi', code: 'HIN', description: 'Hindi Language', schoolId },
      { name: 'Science', code: 'SCI', description: 'General Science', schoolId },
      { name: 'Social Studies', code: 'SST', description: 'Social Studies', schoolId },
      { name: 'Physics', code: 'PHY', description: 'Physics', schoolId },
      { name: 'Chemistry', code: 'CHE', description: 'Chemistry', schoolId },
      { name: 'Biology', code: 'BIO', description: 'Biology', schoolId },
      { name: 'Computer Science', code: 'CS', description: 'Computer Science', schoolId },
      { name: 'Physical Education', code: 'PE', description: 'Physical Education', schoolId }
    ];

    for (const subject of subjects) {
      const existing = await this.subjectRepository.findOne({
        where: { code: subject.code, schoolId }
      });
      if (!existing) {
        await this.subjectRepository.save(this.subjectRepository.create(subject));
      }
    }
  }

  private async seedTeachers(schoolId: string) {
    const teachers = [
      {
        employeeId: 'EMP001',
        firstName: 'Rajesh',
        lastName: 'Kumar',
        email: 'rajesh.kumar@school.edu',
        phone: '+91-9876543210',
        dateOfBirth: new Date('1985-05-15'),
        gender: 'Male',
        address: '123 Teacher Colony, Delhi',
        qualification: 'M.Sc Mathematics, B.Ed',
        experience: '8 years',
        joiningDate: new Date('2020-06-01'),
        salary: 55000,
        subjects: ['Mathematics', 'Physics'],
        status: 'Active',
        schoolId
      },
      {
        employeeId: 'EMP002',
        firstName: 'Priya',
        lastName: 'Sharma',
        email: 'priya.sharma@school.edu',
        phone: '+91-9876543211',
        dateOfBirth: new Date('1988-08-22'),
        gender: 'Female',
        address: '456 Education Street, Mumbai',
        qualification: 'M.A English, B.Ed',
        experience: '6 years',
        joiningDate: new Date('2021-04-15'),
        salary: 52000,
        subjects: ['English', 'Hindi'],
        status: 'Active',
        schoolId
      },
      {
        employeeId: 'EMP003',
        firstName: 'Amit',
        lastName: 'Patel',
        email: 'amit.patel@school.edu',
        phone: '+91-9876543212',
        dateOfBirth: new Date('1982-12-10'),
        gender: 'Male',
        address: '789 Science Park, Bangalore',
        qualification: 'M.Sc Physics, B.Ed',
        experience: '12 years',
        joiningDate: new Date('2018-07-01'),
        salary: 65000,
        subjects: ['Physics', 'Chemistry'],
        status: 'Active',
        schoolId
      }
    ];

    for (const teacher of teachers) {
      const existing = await this.teacherRepository.findOne({
        where: { employeeId: teacher.employeeId, schoolId }
      });
      if (!existing) {
        await this.teacherRepository.save(this.teacherRepository.create(teacher));
      }
    }
  }

  private async seedStudents(schoolId: string) {
    const students = [
      {
        rollNumber: '001',
        admissionNumber: 'ADM2023001',
        firstName: 'Aarav',
        lastName: 'Singh',
        dateOfBirth: new Date('2008-03-15'),
        gender: 'Male',
        fatherName: 'Vikram Singh',
        motherName: 'Sunita Singh',
        parentPhone: '+91-9876543220',
        parentEmail: 'vikram.singh@email.com',
        address: '123 Student Colony, Delhi',
        admissionDate: new Date('2023-04-01'),
        status: 'Active',
        bloodGroup: 'B+',
        religion: 'Hindu',
        category: 'General',
        transportRequired: true,
        hostelRequired: false,
        schoolId
      },
      {
        rollNumber: '002',
        admissionNumber: 'ADM2023002',
        firstName: 'Ananya',
        lastName: 'Gupta',
        dateOfBirth: new Date('2008-07-22'),
        gender: 'Female',
        fatherName: 'Rohit Gupta',
        motherName: 'Kavita Gupta',
        parentPhone: '+91-9876543221',
        parentEmail: 'rohit.gupta@email.com',
        address: '456 Education Avenue, Mumbai',
        admissionDate: new Date('2023-04-01'),
        status: 'Active',
        bloodGroup: 'A+',
        religion: 'Hindu',
        category: 'General',
        transportRequired: false,
        hostelRequired: false,
        schoolId
      },
      {
        rollNumber: '003',
        admissionNumber: 'ADM2023003',
        firstName: 'Mohammed',
        lastName: 'Ali',
        dateOfBirth: new Date('2008-11-08'),
        gender: 'Male',
        fatherName: 'Abdul Ali',
        motherName: 'Fatima Ali',
        parentPhone: '+91-9876543222',
        parentEmail: 'abdul.ali@email.com',
        address: '789 Unity Street, Hyderabad',
        admissionDate: new Date('2023-04-01'),
        status: 'Active',
        bloodGroup: 'O+',
        religion: 'Islam',
        category: 'OBC',
        transportRequired: true,
        hostelRequired: true,
        schoolId
      },
      {
        rollNumber: '004',
        admissionNumber: 'ADM2023004',
        firstName: 'Priya',
        lastName: 'Sharma',
        dateOfBirth: new Date('2009-01-12'),
        gender: 'Female',
        fatherName: 'Suresh Sharma',
        motherName: 'Rekha Sharma',
        parentPhone: '+91-9876543223',
        parentEmail: 'suresh.sharma@email.com',
        address: '321 Green Park, Pune',
        admissionDate: new Date('2023-04-01'),
        status: 'Active',
        bloodGroup: 'AB+',
        religion: 'Hindu',
        category: 'SC',
        transportRequired: false,
        hostelRequired: false,
        schoolId
      },
      {
        rollNumber: '005',
        admissionNumber: 'ADM2023005',
        firstName: 'Arjun',
        lastName: 'Patel',
        dateOfBirth: new Date('2007-09-30'),
        gender: 'Male',
        fatherName: 'Kiran Patel',
        motherName: 'Nisha Patel',
        parentPhone: '+91-9876543224',
        parentEmail: 'kiran.patel@email.com',
        address: '654 Commerce Street, Ahmedabad',
        admissionDate: new Date('2023-04-01'),
        status: 'Active',
        bloodGroup: 'O-',
        religion: 'Hindu',
        category: 'EWS',
        transportRequired: true,
        hostelRequired: false,
        emergencyContact: '+91-9876543225',
        schoolId
      }
    ];

    for (const student of students) {
      const existing = await this.studentRepository.findOne({
        where: { rollNumber: student.rollNumber, schoolId }
      });
      if (!existing) {
        await this.studentRepository.save(this.studentRepository.create(student));
      }
    }
  }

  private async seedFeeStructures(schoolId: string) {
    const feeStructures = [
      {
        feeName: 'Tuition Fee',
        amount: 15000,
        frequency: 'Monthly',
        category: 'Tuition',
        isOptional: false,
        dueDate: new Date('2023-05-05'),
        schoolId
      },
      {
        feeName: 'Transport Fee',
        amount: 3000,
        frequency: 'Monthly',
        category: 'Transport',
        isOptional: true,
        dueDate: new Date('2023-05-05'),
        schoolId
      },
      {
        feeName: 'Library Fee',
        amount: 500,
        frequency: 'Annual',
        category: 'Library',
        isOptional: false,
        dueDate: new Date('2023-04-30'),
        schoolId
      },
      {
        feeName: 'Laboratory Fee',
        amount: 2000,
        frequency: 'Annual',
        category: 'Laboratory',
        isOptional: false,
        dueDate: new Date('2023-04-30'),
        schoolId
      },
      {
        feeName: 'Sports Fee',
        amount: 1000,
        frequency: 'Annual',
        category: 'Sports',
        isOptional: true,
        dueDate: new Date('2023-04-30'),
        schoolId
      }
    ];

    for (const fee of feeStructures) {
      const existing = await this.feeStructureRepository.findOne({
        where: { feeName: fee.feeName, schoolId }
      });
      if (!existing) {
        await this.feeStructureRepository.save(this.feeStructureRepository.create(fee));
      }
    }
  }

  // Time Tables (keeping existing implementation)
  async getTimeTables(schoolId: string, classId?: string, teacherId?: string) {
    const query = this.timeTableRepository.createQueryBuilder('timetable')
      .leftJoinAndSelect('timetable.class', 'class')
      .leftJoinAndSelect('timetable.subject', 'subject')
      .leftJoinAndSelect('timetable.teacher', 'teacher')
      .where('timetable.schoolId = :schoolId', { schoolId });

    if (classId) {
      query.andWhere('timetable.classId = :classId', { classId });
    }

    if (teacherId) {
      query.andWhere('timetable.teacherId = :teacherId', { teacherId });
    }

    return await query.orderBy('timetable.dayOfWeek').addOrderBy('timetable.periodNumber').getMany();
  }

  async createTimeTable(data: any) {
    const timeTable = this.timeTableRepository.create(data);
    return await this.timeTableRepository.save(timeTable);
  }

  async updateTimeTable(id: string, data: any) {
    await this.timeTableRepository.update(id, data);
    return await this.timeTableRepository.findOne({ where: { id } });
  }

  async deleteTimeTable(id: string) {
    return await this.timeTableRepository.delete(id);
  }

  // Class-Subject Mappings (keeping existing implementation)
  async getClassSubjectMappings(schoolId: string, classId?: string) {
    const query = this.classSubjectMappingRepository.createQueryBuilder('mapping')
      .leftJoinAndSelect('mapping.class', 'class')
      .leftJoinAndSelect('mapping.subject', 'subject')
      .where('mapping.schoolId = :schoolId', { schoolId });

    if (classId) {
      query.andWhere('mapping.classId = :classId', { classId });
    }

    return await query.getMany();
  }

  async createClassSubjectMapping(data: any) {
    const mapping = this.classSubjectMappingRepository.create(data);
    return await this.classSubjectMappingRepository.save(mapping);
  }

  async deleteClassSubjectMapping(id: string) {
    return await this.classSubjectMappingRepository.delete(id);
  }
}