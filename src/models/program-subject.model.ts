// src/models/program-subject.model.ts
import { Table, Column, Model, DataType, ForeignKey } from 'sequelize-typescript';
import { Program } from './program.model';
import { Subject } from './subject.model';

@Table({ tableName: 'program_subjects', timestamps: false })
export class ProgramSubject extends Model {
  @ForeignKey(() => Program)
  @Column({ type: DataType.INTEGER })
  declare programId: number;

  @ForeignKey(() => Subject)
  @Column({ type: DataType.INTEGER })
  declare subjectId: number;
}