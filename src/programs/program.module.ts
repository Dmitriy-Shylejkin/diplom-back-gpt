import { Module } from '@nestjs/common';
import { ProgramService } from './program.service';
import { ProgramController } from './program.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Program } from '../models/program.model';
import { Subject } from 'src/models/subject.model';
import { ProgramSubject } from 'src/models/program-subject.model';

@Module({
  imports: [
    SequelizeModule.forFeature([Program, Subject, ProgramSubject]),
  ],
  controllers: [ProgramController],
  providers: [ProgramService],
})
export class ProgramModule {}
