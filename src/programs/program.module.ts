import { Module } from '@nestjs/common';
import { ProgramService } from './program.service';
import { ProgramController } from './program.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Program } from '../models/program.model';

@Module({
  imports: [
    SequelizeModule.forFeature([Program]),
  ],
  controllers: [ProgramController],
  providers: [ProgramService],
})
export class ProgramModule {}
