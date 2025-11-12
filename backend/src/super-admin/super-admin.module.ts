import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SuperAdminController } from './super-admin.controller';
import { SuperAdminService } from './super-admin.service';
import { School } from './entities/school.entity';
import { PlatformSettings } from './entities/platform-settings.entity';
import { BillingRecord } from './entities/billing-record.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([School, PlatformSettings, BillingRecord, User])
  ],
  controllers: [SuperAdminController],
  providers: [SuperAdminService],
  exports: [SuperAdminService]
})
export class SuperAdminModule {}