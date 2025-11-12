import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, Unique } from 'typeorm';
import { Student } from '../../students/entities/student.entity';
import { User } from '../../users/entities/user.entity';

@Entity('attendance')
@Unique(['tenantId', 'studentId', 'date'])
export class Attendance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tenantId: string;

  @ManyToOne(() => Student)
  student: Student;

  @Column()
  studentId: string;

  @Column('date')
  date: Date;

  @Column({ default: 'present' })
  status: string; // present, absent, late

  @ManyToOne(() => User)
  markedBy: User;

  @Column()
  markedById: string;

  @CreateDateColumn()
  markedAt: Date;
}