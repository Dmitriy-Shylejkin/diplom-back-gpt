// src/models/subject.model.ts
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
  BelongsToMany,
} from 'sequelize-typescript';
import { Program } from './program.model';
import { Grade } from './grade.model';
import { ProgramSubject } from './program-subject.model';

@Table({ 
  tableName: 'subjects',
  timestamps: true,
})
export class Subject extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @Column({ 
    type: DataType.STRING, 
    allowNull: false 
  })
  declare name: string;

  @HasMany(() => Grade)
  declare grades: Grade[];

  @BelongsToMany(() => Program, () => ProgramSubject)
  declare programs: Program[];
}