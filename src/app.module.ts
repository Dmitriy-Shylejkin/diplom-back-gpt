import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';

import { AuthModule }    from './auth/auth.module';
import { UserModule }    from './user/user.module';
import { FacultyModule } from './faculty/faculty.module';
import { ProgramModule } from './programs/program.module';
import { SubjectModule } from './subject/subject.module';
import { GroupModule }   from './groups/group.module';
import { StudentModule}  from './students/student.module';
import { CuratorModule}  from './curators/curator.module';
import { GradeModule }   from './grades/grade.module';
import { EmailModule }   from './email/email.module';
import { ReportsModule } from './reports/reports.module';

import { JwtAuthGuard } from './auth/jwt.guard';
import { RolesGuard }   from './auth/roles.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        dialect: 'postgres',
        host:     cfg.get<string>('DB_HOST'),
        port:     cfg.get<number>('DB_PORT', 5432),
        username: cfg.get<string>('DB_USER'),
        password: cfg.get<string>('DB_PASSWORD'),
        database: cfg.get<string>('DB_NAME'),
        autoLoadModels: true,
        synchronize: false,
      }),
    }),
    AuthModule,
    UserModule,
    FacultyModule,
    ProgramModule,
    SubjectModule,
    GroupModule,
    StudentModule,
    CuratorModule,
    GradeModule,
    EmailModule,
    ReportsModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
