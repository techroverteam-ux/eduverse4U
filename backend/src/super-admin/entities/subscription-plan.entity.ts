import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { School } from './school.entity';

@Entity('subscription_plans')
export class SubscriptionPlan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  code: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  monthlyPrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  yearlyPrice: number;

  @Column({ type: 'int' })
  maxStudents: number;

  @Column({ type: 'int' })
  maxBranches: number;

  @Column('simple-array')
  features: string[];

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => School, school => school.subscriptionPlan)
  schools: School[];
}