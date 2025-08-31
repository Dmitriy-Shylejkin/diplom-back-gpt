import {
  Injectable,
  HttpException,
  HttpStatus,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../models/user.model';
import { Group } from '../models/group.model';
import { Student } from 'src/models/student.model';
import { Grade } from 'src/models/grade.model';
import { Subject } from 'src/models/subject.model';
import { Workbook } from 'exceljs';
import * as fs from 'fs';
import * as path from 'path';
import * as bcrypt from 'bcrypt';
import { CreateCuratorDto } from './dto/create-curator.dto';

@Injectable()
export class CuratorService {
  private readonly reportsFolder: string;

  constructor(
    @InjectModel(User) private readonly userModel: typeof User,
    @InjectModel(Group) private readonly groupModel: typeof Group,
    @InjectModel(Student) private readonly studentModel: typeof Student,
    @InjectModel(Grade) private readonly gradeModel: typeof Grade,
    @InjectModel(Subject) private readonly subjectModel: typeof Subject,
  ) {
    this.reportsFolder = path.join(process.cwd(), 'reports');
    // Создаем папку для отчетов, если ее нет
    if (!fs.existsSync(this.reportsFolder)) {
      fs.mkdirSync(this.reportsFolder, { recursive: true });
    }
  }

  /**
   * Привязывает список групп к куратору.
   * Проверяет, что куратор существует (иначе 409),
   * проверяет наличие всех групп (иначе 409),
   * обновляет поле curatorId на всех группах и возвращает их.
   */
  async assignGroups(curatorId: number, groupId: number) {
    console.log('fsdfsdfs')
    // 1) Проверяем существование куратора
    const curator = await this.userModel.findOne({
      where: { id: curatorId, role: 'curator' },
    });
    if (!curator) {
      throw new HttpException(
        `Curator with id ${curatorId} not found`,
        HttpStatus.CONFLICT,
      );
    }
    console.log('here')

    // 2) Проверяем существование всех групп
    const groups = await this.groupModel.findAll({
      // where: { id: groupIds },
    });

    const foundIds = groups.map(g => g.id);

    if (!foundIds.includes(groupId)) {
      throw new HttpException(
        `Group with id ${groupId} not found`,
        HttpStatus.CONFLICT,
      );
    }

    // 3) Обновляем curatorId у всех групп
    await this.groupModel.update(
      { curatorId },
      { where: { id: groupId } },
    );

    // 4) Возвращаем обновлённые группы
    return this.groupModel.findAll({ where: { id: groupId } });
  }

  async getAllGrades(groupId: number, subjectId: number) {
    const students = await this.studentModel.findAll({
      where: { groupId },
      include: {
        model: Grade,
        where: { subjectId },
        required: false
      }
    });

    const result = students.map(student => {
      const studentData = student.get({ plain: true });
      const gradeData = studentData.Grades && studentData.Grades.length > 0 ? studentData.Grades[0].grade : null;

      return {
        studentId: studentData.id,
        fullName: studentData.fullName,
        email: studentData.email,
        phone: studentData.phone,
        grade: gradeData,
      }

    })
    return result;
  }

  async getAllGradesForStudent(studentId: number) {
    const student = await this.studentModel.findByPk(studentId, {
      include: {
        model: Grade,
        include: [Subject]
      }
    });

    if (!student) {
      throw new HttpException(
        `Student with id ${student} not found`,
        HttpStatus.CONFLICT,
      );
    }

    const result = {
      student: {
        id: student.id,
        fullname: student.fullName,
        email: student.email,
        phone: student.phone,
        groupId: student.groupId,
        characteristic: student.characteristic
      },
      grades: student.Grades.map((grade) => {
        return {
          id: grade.id,
          grade: grade.grade,
          subjectName: grade.subject?.name,
        }
      })
    }

    return result;
  }

  async generateStudentReport(studentId: number, res: any) {
    // Получаем данные студента с оценками
    const student = await this.studentModel.findByPk(studentId, {
      include: [{
        association: 'Grades',
        include: ['subject']
      }],
    });

    if (!student) {
      throw new BadRequestException('Студент не найден');
    }

    // Создаем новую книгу Excel
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Оценки студента');

    // Добавляем заголовки
    worksheet.columns = [
      { header: 'ФИО студента', key: 'fullName', width: 30 },
      { header: 'Группа', key: 'group', width: 15 },
      { header: 'Предмет', key: 'subject', width: 30 },
      { header: 'Оценка', key: 'grade', width: 15 },
      { header: 'Дата оценки', key: 'date', width: 20 },
    ];

    // Добавляем данные
    student.Grades.forEach(grade => {
      worksheet.addRow({
        fullName: student.fullName,
        group: student.groupId,
        subject: grade.subject?.name || 'Не указано',
        grade: grade.grade,
        date: grade.createdAt.toLocaleDateString(),
      });
    });

    // Добавляем сводную информацию
    worksheet.addRow([]); // Пустая строка
    worksheet.addRow(['Всего оценок:', student.Grades.length]);

    const fileName = `student_${studentId}_report_${Date.now()}.xlsx`;
    const filePath = path.join(this.reportsFolder, fileName);

    await workbook.xlsx.writeFile(filePath);
    console.log(`Отчет сохранен: ${filePath}`);

    // Устанавливаем заголовки для ответа
    res.header(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.header(
      'Content-Disposition',
      `attachment; filename=student_${studentId}_report.xlsx`,
    );

    // Отправляем файл
    await workbook.xlsx.write(res);
    res.send();
  }

  async generateGroupSubjectReport(groupId: number, subjectId: number, res: any) {
    try {
      // 1. Получаем всех студентов группы
      const students = await this.studentModel.findAll({
        where: { groupId },
        attributes: ['id', 'fullName', 'email', 'phone']
      });
  
      if (!students || students.length === 0) {
        throw new BadRequestException('В группе нет студентов');
      }
  
      // 2. Получаем информацию о предмете
      const subject = await this.subjectModel.findByPk(subjectId, {
        attributes: ['id', 'name']
      });
  
      if (!subject) {
        throw new BadRequestException('Предмет не найден');
      }
  
      // 3. Получаем оценки студентов по предмету
      const grades = await this.gradeModel.findAll({
        where: { 
          subjectId,
          studentId: students.map(s => s.id) 
        },
        include: [
          { 
            model: this.studentModel,
            attributes: ['fullName']
          }
        ],
        order: [
          ['studentId', 'ASC'],
          ['createdAt', 'DESC']
        ]
      });
  
      // 4. Создаем Excel-документ
      const workbook = new Workbook();
      const worksheet = workbook.addWorksheet(`Оценки по ${subject.name}`);
  
      // Заголовки таблицы
      worksheet.columns = [
        { header: '№', key: 'index', width: 5 },
        { header: 'ФИО студента', key: 'fullName', width: 30 },
        { header: 'Оценка', key: 'grade', width: 15 },
        { header: 'Дата оценки', key: 'date', width: 20 },
      ];
  
      // Заполняем данные
      students.forEach((student, index) => {
        const studentGrades = grades.filter(g => g.studentId === student.id);
        
        if (studentGrades.length > 0) {
          // Если есть оценки - добавляем все
          studentGrades.forEach(grade => {
            worksheet.addRow({
              index: index + 1,
              fullName: student.fullName,
              grade: grade.grade,
              date: grade.createdAt.toLocaleDateString(),
            });
          });
        } else {
          // Если нет оценок
          worksheet.addRow({
            index: index + 1,
            fullName: student.fullName,
            grade: 'Нет оценки',
            date: '-',
          });
        }
      });
  
      // Добавляем сводную информацию
      worksheet.addRow([]);
      worksheet.addRow(['Предмет:', subject.name]);
      worksheet.addRow(['Всего студентов:', students.length]);
      worksheet.addRow(['С оценками:', grades.filter(g => g.grade).length]);
  
      // Генерируем имя файла
      const fileName = `group_${groupId}_subject_${subjectId}_report.xlsx`;
      const filePath = path.join(this.reportsFolder, fileName);
  
      // Сохраняем локально
      await workbook.xlsx.writeFile(filePath);
  
      // Настраиваем ответ
      res.header(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      res.header(
        'Content-Disposition',
        `attachment; filename=${fileName}`
      );
  
      await workbook.xlsx.write(res);
      res.send();
  
  
    } catch (error) {
      console.error('Ошибка генерации отчета:', error);
      throw new BadRequestException('Не удалось сгенерировать отчет');
    }
  }

  async findAll() {
    return this.userModel.findAll({
      where: {
        role: "curator"
      }
    })
  }
  
  async findOne(id) {
    const item = await this.userModel.findByPk(id);
    if (!item) {
      throw new NotFoundException(`Student with id ${id} not found`);
    }
    return item
  }
  async create(dto: CreateCuratorDto) {
    const hash = await bcrypt.hash(dto.password, 10);
    try {
      const user = await this.userModel.create({
        fullName: dto.fullName,
        email: dto.email,
        password: hash,
        role: "curator",
        phone: dto.phone,
      } as any);
      const { password, ...result } = user.get({ plain: true });
      return result;
    } catch (e) {
      if (e.name === 'SequelizeUniqueConstraintError') {
        throw new ConflictException('Email или телефон уже заняты');
      }
      throw e;
    }
  }

  async update(id: number, dto: any) {
    try {
      const item: any = await this.findOne(id);
      const updated = await item.update(dto as any);
      return updated
    } catch (err) {
    }
  }

  async remove(id: number) {
    const item: any = await this.findOne(id);
    await item.destroy();
    return { deleted: true };
  }

  async findOneWithGroup(curatorId) {
    const user = await this.userModel.findOne({
      where: {
        role: "curator",
        id: curatorId
      },
    })

    const groups = await this.groupModel.findAll({
      where: {
        curatorId
      }
    })

    const obj = JSON.parse(JSON.stringify(user))
    obj.groups = groups

    return obj
  }
}
