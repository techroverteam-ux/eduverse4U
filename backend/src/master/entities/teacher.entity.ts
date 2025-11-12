import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { School } from '../../super-admin/entities/school.entity';
import { SchoolBranch } from '../../super-admin/entities/school-branch.entity';

@Entity('teachers')
export class Teacher {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  employeeId: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column({ type: 'date' })
  dateOfBirth: Date;

  @Column({ type: 'enum', enum: ['Male', 'Female', 'Other'] })
  gender: string;

  @Column()
  address: string;

  @Column()
  qualification: string;

  @Column()
  experience: string;

  @Column({ type: 'date' })
  joiningDate: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  salary: number;

  @Column({ type: 'enum', enum: ['Active', 'Inactive', 'On Leave'], default: 'Active' })
  status: string;

  @Column('simple-array', { nullable: true })
  subjects: string[];

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
}