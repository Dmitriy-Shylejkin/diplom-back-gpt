import { Controller, Get, Param, ParseIntPipe, Res } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { Response } from 'express';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  // Заглушка: позже заменим на реальную PDF-генерацию
  @Get('group/:groupId/subject/:subjectId')
  async groupReport(
    @Param('groupId', ParseIntPipe) groupId: number,
    @Param('subjectId', ParseIntPipe) subjectId: number,
    @Res() res: Response,
  ) {
    return this.reportsService.generateGroupReport(groupId, subjectId, res);
  }

  @Get('student/:id')
  async studentReport(
    @Param('id', ParseIntPipe) studentId: number,
    @Res() res: Response,
  ) {
    return this.reportsService.generateStudentReport(studentId, res);
  }
}
