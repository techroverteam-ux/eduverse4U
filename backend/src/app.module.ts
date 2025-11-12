import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { StudentsModule } from './students/students.module';
import { FeesModule } from './fees/fees.module';
import { AttendanceModule } from './attendance/attendance.module';
import { ReportsModule } from './reports/reports.module';
import { NotificationsModule } from './notifications/notifications.module';
import { BulkModule } from './bulk/bulk.module';
import { HealthModule } from './health/health.module';
import { SuperAdminModule } from './super-admin/super-admin.module';
import { MasterModule } from './master/master.module';
import { ParentsModule } from './parents/parents.module';
import { SchoolsModule } from './schools/schools.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'eduverse',
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV !== 'production',
    }),
    AuthModule,
    UsersModule,
    StudentsModule,
    FeesModule,
    AttendanceModule,
    ReportsModule,
    NotificationsModule,
    BulkModule,
    HealthModule,
    SuperAdminModule,
    MasterModule,
    ParentsModule,
    SchoolsModule,
  ],
})
export class AppModule {}