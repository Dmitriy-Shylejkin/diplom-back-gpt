import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Student } from './student.model';
import { Subject } from './subject.model';

@Table({ tableName: 'grades', timestamps: true })
export class Grade extends Model<Grade, { studentId: number; subjectId: number; value: string }> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  declare value: string;

  @ForeignKey(() => Student)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare studentId: number;

  @BelongsTo(() => Student)
  declare student: Student;

  @ForeignKey(() => Subject)
  @Column({ type: DataType.INTEGER, allowNull: true })
  declare subjectId: number;

  @BelongsTo(() => Subject)
  declare subject: Subject;
}
