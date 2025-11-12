import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Student } from '../../students/entities/student.entity';
import { FeeStructure } from './fee-structure.entity';

@Entity('fee_payments')
export class FeePayment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tenantId: string;

  @ManyToOne(() => Student)
  student: Student;

  @Column()
  studentId: string;

  @ManyToOne(() => FeeStructure)
  feeStructure: FeeStructure;

  @Column()
  feeStructureId: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({ nullable: true })
  paymentMethod: string;

  @Column({ nullable: true })
  transactionId: string;

  @Column({ default: () => 'CURRENT_DATE' })
  paymentDate: Date;

  @Column({ default: 'completed' })
  status: string;

  @Column({ unique: true })
  receiptNumber: string;

  @CreateDateColumn()
  createdAt: Date;
}