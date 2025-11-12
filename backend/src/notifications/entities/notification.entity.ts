import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tenantId: string;

  @Column()
  title: string;

  @Column('text')
  message: string;

  @Column()
  type: string; // fee_reminder, attendance_alert, general

  @Column()
  targetRole: string; // parent, teacher, student, all

  @ManyToOne(() => User, { nullable: true })
  targetUser: User;

  @Column({ nullable: true })
  targetUserId: string;

  @Column({ default: false })
  isSent: boolean;

  @Column({ nullable: true })
  sentAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}