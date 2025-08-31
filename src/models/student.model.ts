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
  declare fullName: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  declare email: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  declare phone: string;

  @ForeignKey(() => Group)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare groupId: number;

  @BelongsTo(() => Group)
  declare group: Group;

  @HasMany(() => Grade)
  declare Grades: Grade[];

  @Column({ type: DataType.TEXT, allowNull: true })
  declare characteristic: string;
}
