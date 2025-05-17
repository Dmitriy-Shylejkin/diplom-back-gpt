import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  Req,
  UseGuards,
  ForbiddenException,
  Query,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { AuthRequest } from '../auth/auth.types';

@Controller('students')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StudentController {
  constructor(private readonly service: StudentService) {}

  @Post()
  @Roles('admin', 'curator')
  create(@Body() dto: any, @Req() req: AuthRequest) {
    console.log('dto', dto)
    if (
      req.user.role === 'curator' || req.user.role ==='admin'
    ) {
      return this.service.create(dto);

    } else {
      throw new ForbiddenException(
        'Можно добавлять студентов только в свои группы',
      );
    }
  }

  @Get()
  @Roles('admin', 'curator')
  findAll(
    @Req() req: AuthRequest,
    @Query('groupId') groupId?: number
  ) {
    if (req.user.role === 'admin') {
      return this.service.findAll(groupId);
    }
    // curator: все студенты его групп
    return this.service.findByCurator(req.user.userId);
  }

  @Get(':id')
  @Roles('admin', 'curator')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthRequest,
  ) {
    const student: any = await this.service.findOne(id);
    if (
      req.user.role === 'curator' &&
      student.group.curatorId !== req.user.userId
    ) {
      throw new ForbiddenException('Доступ запрещён');
    }
    return student;
  }

  @Put(':id')
  @Roles('admin', 'curator')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: any,
    @Req() req: AuthRequest,
  ) {
    console.log('id', id)
    console.log('dto', dto)
    const student: any = await this.service.findOne(id);
    if (
      req.user.role === 'curator' &&
      student.group.curatorId !== req.user.userId
    ) {
      throw new ForbiddenException('Доступ запрещён');
    }
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles('admin', 'curator')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthRequest,
  ) {
    const student: any = await this.service.findOne(id);
    if (
      req.user.role === 'curator' &&
      student.group.curatorId !== req.user.userId
    ) {
      throw new ForbiddenException('Доступ запрещён');
    }
    return this.service.remove(id);
  }
}
