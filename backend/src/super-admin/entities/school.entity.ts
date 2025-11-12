import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { BillingRecord } from './billing-record.entity';
import { SubscriptionPlan } from './subscription-plan.entity';
import { SchoolBranch } from './school-branch.entity';

@Entity('schools')
export class School {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Basic Information
  @Column()
  name: string;

  @Column({ unique: true })
  schoolCode: string;

  @Column({ nullable: true })
  registrationNumber: string;

  @Column({ nullable: true })
  affiliationNumber: string;

  @Column({ nullable: true })
  establishedYear: string;

  @Column({ nullable: true })
  schoolType: string;

  @Column({ nullable: true })
  board: string;

  // Address Information
  @Column()
  location: string;

  @Column()
  state: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  pincode: string;

  @Column({ nullable: true })
  district: string;

  @Column({ default: 'India' })
  country: string;

  // Contact Information
  @Column()
  email: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  website: string;

  // Principal Information
  @Column()
  principal: string;

  @Column({ nullable: true })
  principalEmail: string;

  @Column({ nullable: true })
  principalPhone: string;

  @Column({ nullable: true })
  principalQualification: string;

  @Column({ nullable: true })
  principalExperience: string;

  // Admin Information
  @Column({ nullable: true })
  adminName: string;

  @Column({ nullable: true })
  adminEmail: string;

  @Column({ nullable: true })
  adminPhone: string;

  // Academic Information
  @Column('simple-array', { nullable: true })
  mediumOfInstruction: string[];

  @Column('simple-array', { nullable: true })
  classesOffered: string[];

  // Statistics
  @Column({ type: 'int', default: 0 })
  students: number;

  @Column({ type: 'int', default: 0 })
  teachers: number;

  @Column({ type: 'int', default: 0 })
  totalStaff: number;

  @Column({ type: 'int', default: 0 })
  totalClassrooms: number;

  // Infrastructure
  @Column({ default: false })
  hasLibrary: boolean;

  @Column({ default: false })
  hasLaboratory: boolean;

  @Column({ default: false })
  hasComputerLab: boolean;

  @Column({ default: false })
  hasPlayground: boolean;

  @Column({ default: false })
  hasAuditorium: boolean;

  @Column({ default: false })
  hasMedicalRoom: boolean;

  @Column({ default: false })
  hasCanteen: boolean;

  @Column({ default: false })
  hasTransport: boolean;

  // Business Information
  @Column({ default: 'basic' })
  selectedPackage: string;

  @Column({ type: 'enum', enum: ['Active', 'Inactive', 'Trial', 'Suspended', 'Pending'], default: 'Pending' })
  status: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  monthlyRevenue: number;

  @Column({ type: 'enum', enum: ['monthly', 'yearly'], default: 'monthly' })
  billingCycle: string;

  @Column({ type: 'timestamp', nullable: true })
  subscriptionStartDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  subscriptionEndDate: Date;

  @Column({ type: 'int', default: 1 })
  totalBranches: number;

  @Column({ type: 'timestamp', nullable: true })
  lastActive: Date;

  @CreateDateColumn()
  joinedDate: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => User, user => user.school)
  users: User[];

  @OneToMany(() => BillingRecord, billing => billing.school)
  billingRecords: BillingRecord[];

  @ManyToOne(() => SubscriptionPlan, plan => plan.schools)
  @JoinColumn({ name: 'subscription_plan_id' })
  subscriptionPlan: SubscriptionPlan;

  @Column({ nullable: true })
  subscriptionPlanId: string;

  @OneToMany(() => SchoolBranch, branch => branch.school)
  branches: SchoolBranch[];
}