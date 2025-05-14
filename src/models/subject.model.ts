import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { Program } from './program.model';
import { Grade } from './grade.model';

@Table({ tableName: 'subjects', timestamps: true })
export class Subject extends Model<Subject, { name: string; programId?: number }> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  declare name: string;

  @ForeignKey(() => Program)
  @Column({ type: DataType.INTEGER, allowNull: true })
  declare programId: number;

  @BelongsTo(() => Program)
  declare program: Program;

  @HasMany(() => Grade)
  declare grades: Grade[];
}
