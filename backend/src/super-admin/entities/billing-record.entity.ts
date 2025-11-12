import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { School } from './school.entity';

@Entity('billing_records')
export class BillingRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  schoolId: string;

  @Column()
  invoiceNumber: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column()
  billingPeriod: string;

  @Column({ type: 'date' })
  dueDate: Date;

  @Column({ type: 'date', nullable: true })
  paidDate: Date;

  @Column({ type: 'enum', enum: ['Paid', 'Pending', 'Overdue', 'Failed'], default: 'Pending' })
  status: string;

  @Column()
  paymentMethod: string;

  @Column({ type: 'json', nullable: true })
  paymentDetails: any;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => School, school => school.billingRecords)
  @JoinColumn({ name: 'schoolId' })
  school: School;
}