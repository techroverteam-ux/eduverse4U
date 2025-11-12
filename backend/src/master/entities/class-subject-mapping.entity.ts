import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Class } from './class.entity';
import { Subject } from './subject.entity';
import { School } from '../../super-admin/entities/school.entity';

@Entity('class_subject_mappings')
export class ClassSubjectMapping {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int', default: 1 })
  periodsPerWeek: number;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

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

  @ManyToOne(() => School)
  @JoinColumn({ name: 'school_id' })
  school: School;

  @Column()
  schoolId: string;
}