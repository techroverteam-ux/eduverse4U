import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { School } from '../../super-admin/entities/school.entity';
import { SchoolBranch } from '../../super-admin/entities/school-branch.entity';
import { AcademicYear } from './academic-year.entity';

@Entity('classes')
export class Class {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  section: string;

  @Column({ nullable: true })
  classTeacher: string;

  @Column({ type: 'int', default: 0 })
  maxStudents: number;

  @Column({ type: 'int', default: 0 })
  currentStudents: number;

  @Column({ default: true })
  isActive: boolean;

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

  @ManyToOne(() => AcademicYear)
  @JoinColumn({ name: 'academic_year_id' })
  academicYear: AcademicYear;

  @Column()
  academicYearId: string;
}