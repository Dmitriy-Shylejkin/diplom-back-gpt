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
import { GradeService } from './grade.service';
import { CreateGradeDto } from './dto/create-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('grades')
@UseGuards(JwtAuthGuard, RolesGuard)
export class GradeController {
  constructor(private readonly service: GradeService) {}

  @Post()
  @Roles('admin', 'curator')
  create(@Body() dto: CreateGradeDto) {
    return this.service.create(dto);
  }

  @Get()
  @Roles('admin', 'curator')
  findAll() {
    return this.service.findAll();
  }

  @Get('student/:id')
  @Roles('admin', 'curator')
  findAllGradeForStudent(
    @Param('id', ParseIntPipe) studentId: number
  ) {
    return this.service.findAllGradeForStudent(studentId);
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
    @Body() dto: UpdateGradeDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
