import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Student } from '../models/student.model';
import { Group } from '../models/group.model';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentService {
  constructor(
    @InjectModel(Student) private readonly model: typeof Student,
    @InjectModel(Group) private readonly groupModel: typeof Group,
  ) {}

  async create(dto: CreateStudentDto) {
    const d = dto as any;
    const group = await this.groupModel.findByPk(d.groupId);
    if (!group) {
      throw new ConflictException(`Group with id ${d.groupId} not found`);
    }
    return this.model.create(d);
  }

  findAll(groupId) {
    const options: any = {
      include: ['group'] 
    }

    if (groupId) {
      options.where = { groupId }
    }
    return this.model.findAll(options);
  }

  async findByCurator(curatorId: number) {
    return this.model.findAll({
      include: [
        {
          model: Group,
          where: { curatorId } as any,
        },
      ],
    });
  }

  async findOne(id: number) {
    const item = await this.model.findByPk(id, { include: ['group'] });
    if (!item) {
      throw new NotFoundException(`Student with id ${id} not found`);
    }
    return item;
  }

  async update(id: number, dto: UpdateStudentDto) {
    const item = await this.findOne(id);
    return item.update(dto as any);
  }

  async remove(id: number) {
    const item = await this.findOne(id);
    await item.destroy();
    return { deleted: true };
  }
}
