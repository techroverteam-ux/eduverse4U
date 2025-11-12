import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { BillingRecord } from './billing-record.entity';

@Entity('schools')
export class School {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  location: string;

  @Column()
  state: string;

  @Column()
  principal: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column({ type: 'int', default: 0 })
  students: number;

  @Column({ type: 'int', default: 0 })
  teachers: number;

  @Column({ type: 'enum', enum: ['Basic', 'Standard', 'Premium'], default: 'Basic' })
  plan: string;

  @Column({ type: 'enum', enum: ['Active', 'Inactive', 'Trial', 'Suspended'], default: 'Trial' })
  status: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  monthlyRevenue: number;

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
}