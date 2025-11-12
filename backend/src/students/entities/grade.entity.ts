import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Student } from './student.entity';

@Entity('grades')
export class Grade {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Student, student => student.grades)
  student: Student;

  @Column()
  studentId: string;

  @Column()
  subject: string;

  @Column()
  examType: string; // 'midterm', 'final', 'assignment', 'quiz'

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  marksObtained: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  totalMarks: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  percentage: number;

  @Column()
  grade: string; // A+, A, B+, etc.

  @Column()
  academicYear: string;

  @Column()
  term: string; // 'Term 1', 'Term 2', etc.

  @Column({ nullable: true })
  remarks: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}