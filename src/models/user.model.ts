import {
  Table, Column, Model, DataType,
} from 'sequelize-typescript';

@Table({ tableName: 'users', timestamps: true })
export class User extends Model<User> {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  declare id: number;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  declare email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare password: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare fullName: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  declare phone: string;

  @Column({ type: DataType.ENUM('admin', 'curator'), allowNull: false, defaultValue: 'curator' })
  declare role: 'admin' | 'curator';
}
