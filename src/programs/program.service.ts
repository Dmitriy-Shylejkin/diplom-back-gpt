import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Program } from '../models/program.model';
import { CreateProgramDto } from './dto/create-program.dto';
import { UpdateProgramDto } from './dto/update-program.dto';
import { Subject } from '../models/subject.model';
import { ProgramSubject } from '../models/program-subject.model';

@Injectable()
export class ProgramService {
  constructor(
    @InjectModel(Program)
    private readonly programModel: typeof Program,
    @InjectModel(Subject)
    readonly subjectModel: typeof Subject,
    @InjectModel(ProgramSubject)
    private readonly programSubjectModel: typeof ProgramSubject,
  ) {}

  async create(dto: CreateProgramDto) {
    // Проверка уникальности кода программы
    const exists = await this.programModel.findOne({
      where: { code: dto.code },
    });
    if (exists) {
      throw new ConflictException(`Program with code "${dto.code}" already exists`);
    }

    const programData = {
      name: dto.name,
      code: dto.code,
      facultyId: dto.facultyId,
      shortName: dto.shortName ?? null,
    } as any;

    // Создаем программу
    const program = await this.programModel.create(programData);

    // Добавляем предметы, если они указаны
    if (dto.subjectIds && dto.subjectIds.length > 0) {
      await this.addSubjectsToProgram(program.id, dto.subjectIds);
    }

    return this.findOne(program.id);
  }

  async addSubjectsToProgram(programId: number, subjectIds: number[]) {
    // Проверяем существование всех предметов
    const subjects = await this.subjectModel.findAll({
      where: { id: subjectIds },
    });

    if (subjects.length !== subjectIds.length) {
      const foundIds = subjects.map(s => s.id);
      const missingIds = subjectIds.filter(id => !foundIds.includes(id));
      throw new NotFoundException(
        `Subjects with IDs [${missingIds.join(', ')}] not found`,
      );
    }

    // Создаем связи
    await this.programSubjectModel.bulkCreate(
      subjectIds.map(subjectId => ({
        programId,
        subjectId,
      })),
    );
  }

  async findAll(id?: number) {
    const options: any = {
      include: [
        'faculty',
        {
          association: 'subjects',
          through: { attributes: [] }, // Скрываем промежуточную таблицу
        },
      ],
    };

    if (id) {
      options.where = { facultyId: id };
    }

    return this.programModel.findAll(options);
  }

  async findOne(id: number) {
    const program = await this.programModel.findByPk(id, {
      include: [
        'faculty',
        {
          association: 'subjects',
          through: { attributes: [] },
        },
      ],
    });

    if (!program) {
      throw new NotFoundException(`Program with ID ${id} not found`);
    }

    return program;
  }

  async update(id: number, dto: UpdateProgramDto) {
    const program = await this.findOne(id);

    // Обновляем основные данные
    await program.update({
      name: dto.name,
      code: dto.code,
      shortName: dto.shortName,
      facultyId: dto.facultyId,
    });

    // Обновляем связи с предметами, если они указаны
    if (dto.subjectIds) {
      await program.$set('subjects', dto.subjectIds);
    }

    return this.findOne(id);
  }

  async remove(id: number) {
    const program = await this.findOne(id);
    await program.destroy();
    return { deleted: true };
  }

  async findAllByFaculty(facultyId: any) {
    return this.programModel.findAll({
      where: {
        facultyId: facultyId
      }
    });
  }
}