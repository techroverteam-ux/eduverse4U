import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Parent } from './parent.entity';
import { Student } from '../../students/entities/student.entity';

@Entity('complaints')
export class Complaint {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Parent, parent => parent.complaints)
  parent: Parent;

  @Column()
  parentId: string;

  @ManyToOne(() => Student)
  student: Student;

  @Column()
  studentId: string;

  @Column()
  category: string; // 'academic', 'behavioral', 'financial', 'facility', 'other'

  @Column()
  subject: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ default: 'open' })
  status: string; // 'open', 'in_progress', 'resolved', 'closed'

  @Column({ default: 'low' })
  priority: string; // 'low', 'medium', 'high', 'urgent'

  @Column({ nullable: true, type: 'text' })
  response: string;

  @Column({ nullable: true })
  resolvedBy: string;

  @Column({ nullable: true })
  resolvedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}