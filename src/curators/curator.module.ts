import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { CuratorService } from './curator.service';
import { CuratorController } from './curator.controller';
import { User } from '../models/user.model';
import { Group } from '../models/group.model';

@Module({
  imports: [
    // Импортируем оба провайдера: User (чтобы @InjectModel(User) работал)
    // и Group (чтобы @InjectModel(Group) работал)
    SequelizeModule.forFeature([User, Group]),
  ],
  controllers: [CuratorController],
  providers: [CuratorService],
  exports: [CuratorService],
})
export class CuratorModule {}
