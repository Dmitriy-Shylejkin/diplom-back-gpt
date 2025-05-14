import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Group } from '../models/group.model';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';

@Module({
  imports: [SequelizeModule.forFeature([Group])],
  providers: [GroupService],
  controllers: [GroupController],
})
export class GroupModule {}
