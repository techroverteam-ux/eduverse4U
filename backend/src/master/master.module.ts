import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { MasterController } from './master.controller';
import { MasterService } from './master.service';
import { AcademicYear } from './entities/academic-year.entity';
import { Class } from './entities/class.entity';
import { Subject } from './entities/subject.entity';
import { ClassSubjectMapping } from './entities/class-subject-mapping.entity';
import { Teacher } from './entities/teacher.entity';
import { Student } from './entities/student.entity';
import { FeeStructure } from './entities/fee-structure.entity';
import { TimeTable } from './entities/time-table.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AcademicYear,
      Class,
      Subject,
      ClassSubjectMapping,
      Teacher,
      Student,
      FeeStructure,
      TimeTable
    ]),
    MulterModule.register({
      dest: './uploads',
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
    })
  ],
  controllers: [MasterController],
  providers: [MasterService],
  exports: [MasterService]
})
export class MasterModule {}