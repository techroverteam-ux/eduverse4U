import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { School } from '../../super-admin/entities/school.entity';
import { SchoolBranch } from '../../super-admin/entities/school-branch.entity';
import { Class } from './class.entity';
import { AcademicYear } from './academic-year.entity';

@Entity('students')
export class Student {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  rollNumber: string;

  @Column()
  admissionNumber: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ type: 'date' })
  dateOfBirth: Date;

  @Column({ type: 'enum', enum: ['Male', 'Female', 'Other'] })
  gender: string;

  @Column()
  fatherName: string;

  @Column()
  motherName: string;

  @Column()
  parentPhone: string;

  @Column()
  parentEmail: string;

  @Column()
  address: string;

  @Column({ type: 'date' })
  admissionDate: Date;

  @Column({ type: 'enum', enum: ['Active', 'Inactive', 'Transferred', 'Graduated'], default: 'Active' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => School)
  @JoinColumn({ name: 'school_id' })
  school: School;

  @Column()
  schoolId: string;

  @ManyToOne(() => SchoolBranch)
  @JoinColumn({ name: 'branch_id' })
  branch: SchoolBranch;

  @Column({ nullable: true })
  branchId: string;

  @ManyToOne(() => Class)
  @JoinColumn({ name: 'class_id' })
  class: Class;

  @Column()
  classId: string;

  @ManyToOne(() => AcademicYear)
  @JoinColumn({ name: 'academic_year_id' })
  academicYear: AcademicYear;

  @Column()
  academicYearId: string;

  @Column({ nullable: true })
  photoUrl: string;

  @Column({ nullable: true })
  bloodGroup: string;

  @Column({ nullable: true })
  religion: string;

  @Column({ nullable: true })
  caste: string;

  @Column({ nullable: true })
  category: string;

  @Column({ nullable: true })
  aadharNumber: string;

  @Column({ nullable: true })
  previousSchool: string;

  @Column({ type: 'boolean', default: false })
  transportRequired: boolean;

  @Column({ type: 'boolean', default: false })
  hostelRequired: boolean;

  @Column({ type: 'text', nullable: true })
  medicalConditions: string;

  @Column({ nullable: true })
  emergencyContact: string;

  @Column({ nullable: true })
  guardianName: string;

  @Column({ nullable: true })
  guardianPhone: string;

  @Column({ nullable: true })
  guardianRelation: string;
}