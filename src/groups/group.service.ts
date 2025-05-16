import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Group } from '../models/group.model';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

@Injectable()
export class GroupService {
  constructor(
    @InjectModel(Group)
    private readonly groupRepo: typeof Group,
  ) {}

  async create(dto: CreateGroupDto) {
    return this.groupRepo.create(dto);
  }

  async findAll(user, programId?: number, curatorId?: number) {
    if (user.role === "admin") {
      return this.groupRepo.findAll({
      });
    } else if (user.role === "curator") {
      const options: any = { curatorId: user.userId };

      if (programId) {
        options.where = { ...options.where, programId };
      }

      if (curatorId) {
        options.where = { ...options.where, curatorId };
      }
      
      return this.groupRepo.findAll(options);
    }

    return [];
  }

  async findOne(id: number) {
    const group = await this.groupRepo.findByPk(id);
    if (!group) throw new BadRequestException('Группа не найдена');
    return group;
  }

  async update(id: number, dto: UpdateGroupDto) {
    const [affected, [updated]] = await this.groupRepo.update(dto, {
      where: { id },
      returning: true,
    });
    if (!affected) throw new BadRequestException('Не удалось обновить группу');
    return updated;
  }

  async remove(id: number) {
    const deleted = await this.groupRepo.destroy({ where: { id } });
    if (!deleted) throw new BadRequestException('Группа не найдена');
    return { deleted: true };
  }
}
