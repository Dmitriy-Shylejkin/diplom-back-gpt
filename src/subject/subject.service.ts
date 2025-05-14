import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Subject } from '../models/subject.model';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';

@Injectable()
export class SubjectService {
  constructor(
    @InjectModel(Subject) private readonly model: typeof Subject,
  ) {}

  async create(dto: CreateSubjectDto) {
    const d = dto as any;
    const exists = await this.model.findOne({
      where: { code: d.code, programId: d.programId } as any,
    });
    if (exists) {
      throw new ConflictException(
        `Subject "${d.code}" already exists in program ${d.programId}`,
      );
    }
    return this.model.create(d);
  }

  findAll() {
    return this.model.findAll({ include: ['program'] });
  }

  async findOne(id: number) {
    const item = await this.model.findByPk(id, { include: ['program'] });
    if (!item) {
      throw new NotFoundException(`Subject with id ${id} not found`);
    }
    return item;
  }

  async update(id: number, dto: UpdateSubjectDto) {
    const item = await this.findOne(id);
    return item.update(dto as any);
  }

  async remove(id: number) {
    const item = await this.findOne(id);
    await item.destroy();
    return { deleted: true };
  }
}
