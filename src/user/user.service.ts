import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../models/user.model';
import { Group } from '../models/group.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private readonly userModel: typeof User,
    @InjectModel(Group) private readonly groupModel: typeof Group,
  ) {}

  /** Возвращает список всех кураторов и их группы */
  async findAllCuratorsWithGroups() {
    return this.userModel.findAll({
      where: { role: 'curator' },
      include: [{ model: Group }],
    });
  }

  /** Возвращает одного куратора + группы */
  async findOneCuratorWithGroups(id: number) {
    const curator = await this.userModel.findOne({
      where: { id, role: 'curator' },
      include: [{ model: Group }],
    });
    if (!curator) {
      throw new NotFoundException(`Curator with id ${id} not found`);
    }
    return curator;
  }
}
