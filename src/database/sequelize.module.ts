import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';

// Модели
import { User } from '../models/user.model';
import { Faculty } from '../models/faculty.model';
import { Program } from '../models/program.model';
import { Group } from '../models/group.model';
import { Student } from '../models/student.model';
import { Subject } from '../models/subject.model';
import { Grade } from '../models/grade.model';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        dialect: 'postgres',
        host: cfg.get<string>('DB_HOST')!,
        port: +cfg.get<number>('DB_PORT')!,              
        username: cfg.get<string>('DB_USER')!,
        password: cfg.get<string>('DB_PASSWORD')!,
        database: cfg.get<string>('DB_NAME')!,
        models: [User, Faculty, Program, Group, Student, Subject, Grade],
        autoLoadModels: true,
        synchronize: false, 
      }),
    }),
  ],
  exports: [SequelizeModule],
})
export class DatabaseModule {}
