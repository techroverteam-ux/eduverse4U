import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Student } from '../../students/entities/student.entity';
import { Complaint } from './complaint.entity';

@Entity('parents')
export class Parent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  user: User;

  @Column()
  userId: string;

  @Column()
  relationship: string; // 'father', 'mother', 'guardian'

  @Column({ nullable: true })
  occupation: string;

  @Column({ nullable: true })
  workAddress: string;

  @Column({ nullable: true })
  emergencyContact: string;

  @OneToMany(() => Student, student => student.parent)
  children: Student[];

  @OneToMany(() => Complaint, complaint => complaint.parent)
  complaints: Complaint[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}