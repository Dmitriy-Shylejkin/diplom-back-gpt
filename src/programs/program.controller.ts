import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ProgramService } from './program.service';
import { CreateProgramDto } from './dto/create-program.dto';
import { UpdateProgramDto } from './dto/update-program.dto';
import { AddSubjectsToProgramDto } from './dto/add-subjects-to-program.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { InjectModel } from '@nestjs/sequelize';
import { ProgramSubject } from 'src/models/program-subject.model';

@Controller('programs')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProgramController {
  constructor( readonly service: ProgramService,
    @InjectModel(ProgramSubject)
    private readonly programSubjectModel: typeof ProgramSubject,
  ) {}

  
  @Post()
  @Roles('admin')
  create(@Body() dto: CreateProgramDto) {
    return this.service.create(dto);
  }

  @Get()
  @Roles('admin', 'curator')
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @Roles('admin', 'curator')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @Roles('admin')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProgramDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }

  @Post(':id/subjects')
  @Roles('admin')
  async addSubjects(
    @Param('id', ParseIntPipe) programId: number,
    @Body() dto: AddSubjectsToProgramDto,
  ) {
    await this.service.addSubjectsToProgram(programId, dto.subjectIds);
    return this.service.findOne(programId);
  }

  @Delete(':id/subjects/:subjectId')
  @Roles('admin')
  async removeSubject(
    @Param('id', ParseIntPipe) programId: number,
    @Param('subjectId', ParseIntPipe) subjectId: number,
  ) {
    await this.programSubjectModel.destroy({
      where: {
        programId,
        subjectId,
      },
    });
    return this.service.findOne(programId);
  }
}
