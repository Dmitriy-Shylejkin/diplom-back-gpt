import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Grade } from '../models/grade.model';
import { Student } from '../models/student.model';
import { Subject } from '../models/subject.model';
import { CreateGradeDto } from './dto/create-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';

@Injectable()
export class GradeService {
  constructor(
    @InjectModel(Grade) private readonly model: typeof Grade,
    @InjectModel(Student) private readonly studentModel: typeof Student,
    @InjectModel(Subject) private readonly subjectModel: typeof Subject,
  ) {}

  async create(dto: CreateGradeDto) {
    const d = dto as any;
    const student = await this.studentModel.findByPk(d.studentId);
    if (!student) {
      throw new ConflictException(`Student with id ${d.studentId} not found`);
    }
    const subject = await this.subjectModel.findByPk(d.subjectId);
    if (!subject) {
      throw new ConflictException(`Subject with id ${d.subjectId} not found`);
    }
    return this.model.create(d);
  }

  findAll() {
    return this.model.findAll({ include: ['student', 'subject'] });
  }

  async findAllGradeForStudent(studentId: number) {
    const student: any = await this.studentModel.findByPk(studentId, {
      include: [Grade]
    });

    const allSubjects = await this.subjectModel.findAll();

    // Преобразуем массив оценок, добавляя subjectName
    const gradesWithSubjectName = student.Grades.map(grade => {
      const subject = allSubjects.find(subject => subject.id === grade.subjectId);
      return {
        ...grade.toJSON(), // Преобразуем экземпляр модели в обычный объект
        subjectName: subject ? subject.name : null
      };
    });

    const newObj = JSON.parse(JSON.stringify(student))

    newObj.Grades = gradesWithSubjectName

    return newObj;
}


  async findOne(id: number) {
    const item = await this.model.findByPk(id, {
      include: ['student', 'subject'],
    });
    if (!item) {
      throw new NotFoundException(`Grade with id ${id} not found`);
    }
    return item;
  }

  async update(id: number, dto: UpdateGradeDto) {
    console.log(dto)
    const item = await this.findOne(id);
    return item.update(dto as any);
  }

  async remove(id: number) {
    const item = await this.findOne(id);
    await item.destroy();
    return { deleted: true };
  }
}
