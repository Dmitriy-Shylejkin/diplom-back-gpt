import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { CuratorService } from './curator.service';
import { CuratorController } from './curator.controller';
import { User } from '../models/user.model';
import { Group } from '../models/group.model';
import { Student } from 'src/models/student.model';

@Module({
  imports: [
    // Импортируем оба провайдера: User (чтобы @InjectModel(User) работал)
    // и Group (чтобы @InjectModel(Group) работал)
    SequelizeModule.forFeature([User, Group, Student]),
  ],
  controllers: [CuratorController],
  providers: [CuratorService],
  exports: [CuratorService],
})
export class CuratorModule {}
