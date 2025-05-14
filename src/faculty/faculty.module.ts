import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Faculty } from '../models/faculty.model';
import { FacultyService } from './faculty.service';
import { FacultyController } from './faculty.controller';

@Module({
  imports: [SequelizeModule.forFeature([Faculty])],
  controllers: [FacultyController],
  providers: [FacultyService],
})
export class FacultyModule {}
