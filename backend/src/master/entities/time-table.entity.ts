import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { School } from '../../super-admin/entities/school.entity';
import { Class } from './class.entity';
import { Subject } from './subject.entity';
import { Teacher } from './teacher.entity';

@Entity('time_tables')
export class TimeTable {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] })
  dayOfWeek: string;

  @Column({ type: 'time' })
  startTime: string;

  @Column({ type: 'time' })
  endTime: string;

  @Column({ type: 'int' })
  periodNumber: number;

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

  @ManyToOne(() => Class)
  @JoinColumn({ name: 'class_id' })
  class: Class;

  @Column()
  classId: string;

  @ManyToOne(() => Subject)
  @JoinColumn({ name: 'subject_id' })
  subject: Subject;

  @Column()
  subjectId: string;

  @ManyToOne(() => Teacher)
  @JoinColumn({ name: 'teacher_id' })
  teacher: Teacher;

  @Column()
  teacherId: string;
}