import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { School } from '../../super-admin/entities/school.entity';
import { Class } from './class.entity';
import { AcademicYear } from './academic-year.entity';

@Entity('fee_structures')
export class FeeStructure {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  feeName: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'enum', enum: ['Monthly', 'Quarterly', 'Half-Yearly', 'Yearly', 'One-Time'], default: 'Monthly' })
  frequency: string;

  @Column({ type: 'enum', enum: ['Tuition', 'Transport', 'Library', 'Laboratory', 'Sports', 'Examination', 'Other'], default: 'Tuition' })
  category: string;

  @Column({ default: false })
  isOptional: boolean;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'date', nullable: true })
  dueDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => School)
  @JoinColumn({ name: 'school_id' })
  school: School;

  @Column()
  schoolId: string;

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
}