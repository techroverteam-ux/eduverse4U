import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Tenant } from '../../common/entities/tenant.entity';
import { School } from '../../super-admin/entities/school.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Tenant)
  tenant: Tenant;

  @Column()
  tenantId: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  phone: string;

  @Column()
  role: string; // super_admin, admin, teacher, parent, student, accountant

  @Column({ nullable: true })
  schoolId: string;

  @Column({ default: 'Active' })
  status: string; // Active, Inactive, Suspended

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => School, school => school.users, { nullable: true })
  school: School;

  @Column({ nullable: true })
  lastLogin: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}