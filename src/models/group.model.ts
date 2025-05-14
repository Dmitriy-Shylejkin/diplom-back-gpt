// src/models/group.model.ts

import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Program } from './program.model';
import { User } from './user.model';
// <-- вот этот импорт
import { CreateGroupDto } from '../groups/dto/create-group.dto';

@Table({
  tableName: 'groups',
  timestamps: true,
})
export class Group extends Model<Group, CreateGroupDto> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;

  @ForeignKey(() => Program)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare programId: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare curatorId: number;

  @BelongsTo(() => Program)
  declare program: Program;

  @BelongsTo(() => User)
  declare curator: User;
}
