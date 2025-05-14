import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Faculty } from '../models/faculty.model';
import { CreateFacultyDto } from './dto/create-faculty.dto';
import { UpdateFacultyDto } from './dto/update-faculty.dto';

@Injectable()
export class FacultyService {
  constructor(
    @InjectModel(Faculty) private readonly model: typeof Faculty,
  ) {}

  async create(dto: CreateFacultyDto) {
    const exists = await this.model.findOne({
      where: { name: dto.name } as any,
    });
    if (exists) {
      throw new ConflictException(`Faculty "${dto.name}" already exists`);
    }
    return this.model.create(dto as any);
  }

  findAll() {
    return this.model.findAll();
  }

  async findOne(id: number) {
    const item = await this.model.findByPk(id);
    if (!item) {
      throw new NotFoundException(`Faculty with id ${id} not found`);
    }
    return item;
  }

  async update(id: number, dto: UpdateFacultyDto) {
    const item = await this.findOne(id);
    return item.update(dto as any);
  }

  async remove(id: number) {
    const item = await this.findOne(id);
    await item.destroy();
    return { deleted: true };
  }
}
