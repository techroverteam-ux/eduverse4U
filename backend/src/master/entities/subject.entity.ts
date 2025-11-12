import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { School } from '../../super-admin/entities/school.entity';

@Entity('subjects')
export class Subject {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  code: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'enum', enum: ['Core', 'Elective', 'Optional'], default: 'Core' })
  type: string;

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
}