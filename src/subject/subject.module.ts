import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Subject } from '../models/subject.model';
import { Program } from '../models/program.model';
import { SubjectService } from './subject.service';
import { SubjectController } from './subject.controller';

@Module({
  imports: [SequelizeModule.forFeature([Subject, Program])],
  controllers: [SubjectController],
  providers: [SubjectService],
})
export class SubjectModule {}
