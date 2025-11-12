import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { School } from './school.entity';

@Entity('school_branches')
export class SchoolBranch {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  branchCode: string;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column({ nullable: true })
  pincode: string;

  @Column()
  phone: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  branchManager: string;

  @Column({ nullable: true })
  managerPhone: string;

  @Column({ nullable: true })
  managerEmail: string;

  @Column({ type: 'int', default: 0 })
  students: number;

  @Column({ type: 'int', default: 0 })
  teachers: number;

  @Column({ type: 'int', default: 0 })
  classrooms: number;

  @Column({ type: 'enum', enum: ['Active', 'Inactive', 'Setup'], default: 'Setup' })
  status: string;

  @Column({ default: false })
  isMainBranch: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => School, school => school.branches)
  @JoinColumn({ name: 'school_id' })
  school: School;

  @Column()
  schoolId: string;
}