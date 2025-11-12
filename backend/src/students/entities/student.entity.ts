import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Tenant } from '../../common/entities/tenant.entity';
import { User } from '../../users/entities/user.entity';
import { Grade } from './grade.entity';
import { Attendance } from '../../attendance/entities/attendance.entity';
import { FeePayment } from '../../fees/entities/fee-payment.entity';

@Entity('students')
export class Student {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Tenant)
  tenant: Tenant;

  @Column()
  tenantId: string;

  @ManyToOne(() => User)
  user: User;

  @Column()
  userId: string;

  @Column({ unique: true })
  admissionNumber: string;

  @Column()
  class: string;

  @Column({ nullable: true })
  section: string;

  @Column({ nullable: true })
  rollNumber: string;

  @Column({ nullable: true })
  dateOfBirth: Date;

  @Column({ nullable: true })
  gender: string;

  @Column({ nullable: true })
  address: string;

  @ManyToOne(() => User, { nullable: true })
  parent: User;

  @Column({ nullable: true })
  parentId: string;

  @Column({ default: () => 'CURRENT_DATE' })
  admissionDate: Date;

  @Column({ nullable: true })
  bloodGroup: string;

  @Column({ nullable: true })
  emergencyContact: string;

  @Column({ nullable: true })
  profileImage: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Grade, grade => grade.student)
  grades: Grade[];

  @OneToMany(() => Attendance, attendance => attendance.student)
  attendanceRecords: Attendance[];

  @OneToMany(() => FeePayment, payment => payment.student)
  feePayments: FeePayment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}