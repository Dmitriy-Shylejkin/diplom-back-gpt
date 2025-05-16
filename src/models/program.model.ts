// src/models/program.model.ts
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
import { Faculty } from './faculty.model';
import { Group } from './group.model';
import { Subject } from './subject.model';
import { ProgramSubject } from './program-subject.model';

@Table({
  tableName: 'programs',
  timestamps: true,
})
export class Program extends Model<Program> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare code: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare shortName: string | null;

  @ForeignKey(() => Faculty)
  @Column({ 
    type: DataType.INTEGER, 
    allowNull: false 
  })
  declare facultyId: number;

  @BelongsTo(() => Faculty)
  declare faculty: Faculty;

  @HasMany(() => Group)
  declare groups: Group[];

  @BelongsToMany(() => Subject, () => ProgramSubject)
  declare subjects: Subject[];
}