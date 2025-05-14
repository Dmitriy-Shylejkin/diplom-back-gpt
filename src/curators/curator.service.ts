import {
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../models/user.model';
import { Group } from '../models/group.model';

@Injectable()
export class CuratorService {
  constructor(
    @InjectModel(User) private readonly userModel: typeof User,
    @InjectModel(Group) private readonly groupModel: typeof Group,
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
}
