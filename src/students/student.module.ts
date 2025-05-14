import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { Student } from '../models/student.model';
import { Group } from '../models/group.model';

@Module({
  imports: [SequelizeModule.forFeature([Student, Group])],
  controllers: [StudentController],
  providers: [StudentService],
  exports: [StudentService],
})
export class StudentModule {}
