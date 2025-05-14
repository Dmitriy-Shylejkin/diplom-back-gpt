import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { Group } from './group.model';
import { Grade } from './grade.model';

@Table({ tableName: 'students' })
export class Student extends Model<Student> {
  @Column({ type: DataType.STRING, allowNull: false })
  fullName: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  email: string;

  @ForeignKey(() => Group)
  @Column({ type: DataType.INTEGER, allowNull: false })
  groupId: number;

  @BelongsTo(() => Group)
  group: Group;

  @HasMany(() => Grade)
  Grades: Grade[];

  @Column({ type: DataType.TEXT, allowNull: true })
  characteristic: string;
}
