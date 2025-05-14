import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Program } from './program.model';

@Table({
  tableName: 'faculties',
  freezeTableName: true,
})
export class Faculty extends Model<Faculty> {
  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  name: string;

  @HasMany(() => Program)
  programs: Program[];
}
