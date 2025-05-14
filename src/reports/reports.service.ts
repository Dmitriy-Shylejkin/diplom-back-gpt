import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Response } from 'express';
import * as PDFDocument from 'pdfkit';

import { Student } from '../models/student.model';
import { Grade } from '../models/grade.model';
import { Subject } from '../models/subject.model';
import { Group } from '../models/group.model';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Student) private readonly studentModel: typeof Student,
    @InjectModel(Grade) private readonly gradeModel: typeof Grade,
    @InjectModel(Subject) private readonly subjectModel: typeof Subject,
    @InjectModel(Group) private readonly groupModel: typeof Group,
  ) {}

  async generateGroupReport(
    groupId: number,
    subjectId: number,
    res: Response,
  ) {
    const group = await this.groupModel.findByPk(groupId);
    if (!group) {
      throw new NotFoundException(`Group with id ${groupId} not found`);
    }
    const subject = await this.subjectModel.findByPk(subjectId);
    if (!subject) {
      throw new NotFoundException(`Subject with id ${subjectId} not found`);
    }

    const students = await this.studentModel.findAll({
      where: { groupId } as any,
      include: [
        {
          model: this.gradeModel,
          where: { subjectId } as any,
          required: false,
        },
      ],
    });

    const doc = new PDFDocument({ margin: 40 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="report_group_${groupId}_subject_${subjectId}.pdf"`,
    );

    doc.fontSize(18).text(`Отчёт по группе: ${group.name}`, { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(16).text(`Предмет: ${subject.name}`, { align: 'center' });
    doc.moveDown();

    doc.fontSize(12).text('ФИО                          Почта                         Оценка');
    doc.moveDown(0.5);

    students.forEach((s) => {
      const gradeObj = (s as any).Grades?.[0];
      const gradeValue = gradeObj ? gradeObj.value : '-';
      doc
        .fontSize(12)
        .text(
          `${s.fullName.padEnd(28)} ${s.email.padEnd(28)} ${gradeValue}`,
        );
    });

    doc.end();
    doc.pipe(res);
  }

  async generateStudentReport(studentId: number, res: Response) {
    const student = await this.studentModel.findByPk(studentId, {
      include: [
        { model: this.groupModel },
        {
          model: this.gradeModel,
          include: [{ model: this.subjectModel }],
        },
      ],
    });
    if (!student) {
      throw new NotFoundException(`Student with id ${studentId} not found`);
    }

    const doc = new PDFDocument({ margin: 40 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="report_student_${studentId}.pdf"`,
    );

    doc
      .fontSize(18)
      .text(`Отчёт по студенту: ${student.fullName}`, { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(12).text(`Email: ${student.email}`);
    doc.moveDown(0.5);
    doc.fontSize(12).text(`Группа: ${(student as any).Group?.name || '-'}`);
    doc.moveDown();

    doc.fontSize(14).text('Характеристика:', { underline: true });
    doc.moveDown(0.3);
    doc.fontSize(12).text((student as any).characteristic || '-', { indent: 20 });
    doc.moveDown();

    doc.fontSize(14).text('Оценки:', { underline: true });
    doc.moveDown(0.3);
    (student as any).Grades.forEach((g: any) => {
      const subj = g.Subject;
      doc
        .fontSize(12)
        .text(`${subj.name}: ${g.value}`, { indent: 20 });
    });

    doc.end();
    doc.pipe(res);
  }
}
