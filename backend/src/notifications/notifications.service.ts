import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  async create(createNotificationDto: any, tenantId: string) {
    const notification = this.notificationRepository.create({
      ...createNotificationDto,
      tenantId,
    });
    
    const saved = await this.notificationRepository.save(notification) as unknown as Notification;
    
    // Simulate SMS/Email sending
    setTimeout(() => this.sendNotification(saved.id), 1000);
    
    return saved;
  }

  async sendBulkFeeReminders(tenantId: string) {
    const notification = await this.create({
      title: 'Fee Reminder',
      message: 'Monthly fee payment is due. Please pay by 5th of this month.',
      type: 'fee_reminder',
      targetRole: 'parent',
    }, tenantId);

    return { message: 'Fee reminders sent to all parents', notificationId: notification.id };
  }

  async sendAttendanceAlert(studentId: string, tenantId: string) {
    return this.create({
      title: 'Attendance Alert',
      message: 'Your child was marked absent today. Please contact school if this is incorrect.',
      type: 'attendance_alert',
      targetRole: 'parent',
      targetUserId: studentId,
    }, tenantId);
  }

  private async sendNotification(notificationId: string) {
    // Mock SMS/Email sending
    await this.notificationRepository.update(notificationId, {
      isSent: true,
      sentAt: new Date(),
    });
  }

  async findAll(tenantId: string, userId?: string) {
    const where: any = { tenantId };
    if (userId) where.targetUserId = userId;

    return this.notificationRepository.find({
      where,
      order: { createdAt: 'DESC' },
      take: 50,
    });
  }
}