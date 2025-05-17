import {
  Controller,
  Post,
  Param,
  Body,
  ParseIntPipe,
  ParseArrayPipe,
  UseGuards,
  Get,
  Res,
  Patch,
  Put,
  Req,
  ForbiddenException,
  Delete
} from '@nestjs/common';
import { CuratorService } from './curator.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateCuratorDto } from './dto/create-curator.dto';
import { AuthRequest } from 'src/auth/auth.types';

@Controller('curators')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CuratorController {
  constructor(private readonly curatorService: CuratorService) {}

  @Post()
  @Roles('admin')
  async createCurator(@Body() dto: CreateCuratorDto) {
    return this.curatorService.create(dto)
  }

  @Get('report/:id')
  @Roles('admin', 'curator')
  async generateReport(
    @Param('id') studentId: number,
    @Res() res: Response,
  ) {
    await this.curatorService.generateStudentReport(studentId, res);
  }

  @Get('group-report/:groupId/:subjectId')
  @Roles('admin', 'curator')
  async generateGroupReport(
  @Param('groupId') groupId: number,
  @Param('subjectId') subjectId: number,
  @Res() res: Response,
  ) {
  await this.curatorService.generateGroupSubjectReport(groupId, subjectId, res);
  }

  @Patch('groups/:id')
  @Roles('admin')
  assignGroups(
    @Param('id', ParseIntPipe) curatorId: number,
    @Body('groupId')
    groupId: number,
  ) {
    console.log('groupId', groupId)
    return this.curatorService.assignGroups(curatorId, groupId);
  }

  @Get('grades/groups/:groupId/subjects/:subjectId')
  @Roles('admin', 'curator')
  getAllGrades(
    @Param('groupId', ParseIntPipe) groupId: number,
    @Param('subjectId', ParseIntPipe) subjectId: number,
  ) {
    return this.curatorService.getAllGrades(groupId, subjectId);
  }

  @Get('grades/student/:id')
  @Roles('admin', 'curator')
  getAllGradesForStudent(
    @Param('id', ParseIntPipe) studentId: number
  ) {
    return this.curatorService.getAllGradesForStudent(studentId);
  }

  @Get('/all-curators')
  @Roles('admin')
  getAllCurators() {
    return this.curatorService.findAll()
  }

  @Put(':id')
  @Roles('admin', 'curator')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: any,
    @Req() req: AuthRequest,
  ) {
    const curator: any = await this.curatorService.findOne(id);
    if (
      req.user.role === 'curator' &&
      curator.id !== req.user.userId
    ) {
      console.log('if')
      throw new ForbiddenException('Доступ запрещён');
    }
    return this.curatorService.update(id, dto);
  }

  @Delete(':id')
  @Roles('admin')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthRequest,
  ) {
    const curator: any = await this.curatorService.findOne(id);
    return this.curatorService.remove(id);
  }
}
