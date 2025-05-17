import {
  Controller,
  Post,
  Param,
  Body,
  ParseIntPipe,
  ParseArrayPipe,
  UseGuards,
  Get,
} from '@nestjs/common';
import { CuratorService } from './curator.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('curators')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CuratorController {
  constructor(private readonly curatorService: CuratorService) {}

  @Post(':id/groups')
  @Roles('admin')
  assignGroups(
    @Param('id', ParseIntPipe) curatorId: number,
    @Body(
      'groupIds',
      new ParseArrayPipe({ items: Number, separator: ',' }),
    )
    groupIds: number[],
  ) {
    return this.curatorService.assignGroups(curatorId, groupIds);
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
}
