import {
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../models/user.model';
import { Group } from '../models/group.model';
import { Student } from 'src/models/student.model';
import { Grade } from 'src/models/grade.model';
import { Subject } from 'src/models/subject.model';

@Injectable()
export class CuratorService {
  constructor(
    @InjectModel(User) private readonly userModel: typeof User,
    @InjectModel(Group) private readonly groupModel: typeof Group,
    @InjectModel(Student) private readonly studentModel: typeof Student,
    @InjectModel(Grade) private readonly gradeModel: typeof Grade,
  ) {}

  /**
   * Привязывает список групп к куратору.
   * Проверяет, что куратор существует (иначе 409),
   * проверяет наличие всех групп (иначе 409),
   * обновляет поле curatorId на всех группах и возвращает их.
   */
  async assignGroups(curatorId: number, groupIds: number[]) {
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

    // 2) Проверяем существование всех групп
    const groups = await this.groupModel.findAll({
      where: { id: groupIds },
    });
    const foundIds = groups.map(g => g.id);
    const missing = groupIds.filter(id => !foundIds.includes(id));
    if (missing.length) {
      throw new HttpException(
        `Groups with ids [${missing.join(', ')}] not found`,
        HttpStatus.CONFLICT,
      );
    }

    // 3) Обновляем curatorId у всех групп
    await this.groupModel.update(
      { curatorId },
      { where: { id: groupIds } },
    );

    // 4) Возвращаем обновлённые группы
    return this.groupModel.findAll({ where: { id: groupIds } });
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
}
