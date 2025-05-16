import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Subject } from '../models/subject.model';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { Program } from 'src/models/program.model';
import { ProgramSubject } from 'src/models/program-subject.model';

@Injectable()
export class SubjectService {
  constructor(
    @InjectModel(Subject) private readonly model: typeof Subject,
  ) {}

  async create(dto: CreateSubjectDto) {
    const subject = await this.model.create({ name: dto.name });
    
    return this.findOne(subject.id); 
  }

  findAll() {
    return this.model.findAll();
  }

  async findOne(id: number) {
    const item = await this.model.findByPk(id);
    if (!item) {
      throw new NotFoundException(`Subject with id ${id} not found`);
    }
    return item;
  }

  async update(id: number, dto: UpdateSubjectDto) {
    const item = await this.findOne(id);
    return item.update({ name: dto.name });
  }

  async remove(id: number) {
    const item = await this.findOne(id);
    await item.destroy();
    return { deleted: true };
  }
}
