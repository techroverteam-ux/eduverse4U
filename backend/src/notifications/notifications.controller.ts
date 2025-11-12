import { Controller, Get, Post, Body, UseGuards, Request, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  create(@Body() createNotificationDto: any, @Request() req) {
    return this.notificationsService.create(createNotificationDto, req.user.tenantId);
  }

  @Post('fee-reminders')
  sendFeeReminders(@Request() req) {
    return this.notificationsService.sendBulkFeeReminders(req.user.tenantId);
  }

  @Get()
  findAll(@Request() req, @Query('userId') userId: string) {
    return this.notificationsService.findAll(req.user.tenantId, userId);
  }
}