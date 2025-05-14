import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Grade } from '../models/grade.model';
import { Student } from '../models/student.model';
import { Subject } from '../models/subject.model';

import { GradeService } from './grade.service';
import { GradeController } from './grade.controller';

@Module({
  imports: [
    // Подключаем все три модели, чтобы Nest мог инжектить репозитории
    SequelizeModule.forFeature([Grade, Student, Subject]),
  ],
  controllers: [GradeController],
  providers: [GradeService],
  exports: [GradeService],
})
export class GradeModule {}
