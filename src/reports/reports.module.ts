import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';

import { Student } from '../models/student.model';
import { Grade } from '../models/grade.model';
import { Subject } from '../models/subject.model';
import { Group } from '../models/group.model';

@Module({
  imports: [
    SequelizeModule.forFeature([Student, Grade, Subject, Group]),
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
