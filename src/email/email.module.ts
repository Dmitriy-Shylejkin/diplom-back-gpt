import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';

import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { Student } from '../models/student.model';
import { Group } from '../models/group.model';
import { StudentService } from 'src/students/student.service';
import { User } from 'src/models/user.model';

@Module({
  imports: [
    ConfigModule,
    SequelizeModule.forFeature([Student, Group, User]),
    
  ],
  controllers: [EmailController],
  providers: [EmailService, StudentService],
})
export class EmailModule {}
