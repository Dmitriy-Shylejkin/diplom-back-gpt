import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Program } from '../models/program.model';
import { CreateProgramDto } from './dto/create-program.dto';
import { UpdateProgramDto } from './dto/update-program.dto';

@Injectable()
export class ProgramService {
  constructor(
    @InjectModel(Program) private readonly model: typeof Program,
  ) {}

  async create(dto: CreateProgramDto) {
    const d = dto as any;
    const exists = await this.model.findOne({
      where: { code: d.code } as any,
    });
    if (exists) {
      throw new ConflictException(`Program "${d.code}" already exists`);
    }
    return this.model.create(d);
  }

  findAll() {
    return this.model.findAll({ include: ['faculty'] });
  }

  async findOne(id: number) {
    const item = await this.model.findByPk(id, { include: ['faculty'] });
    if (!item) {
      throw new NotFoundException(`Program with id ${id} not found`);
    }
    return item;
  }

  async update(id: number, dto: UpdateProgramDto) {
    const item = await this.findOne(id);
    return item.update(dto as any);
  }

  async remove(id: number) {
    const item = await this.findOne(id);
    await item.destroy();
    return { deleted: true };
  }
}
