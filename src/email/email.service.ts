import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { MailerService } from '@nestjs-modules/mailer';
import { Student } from '../models/student.model';
import { Group } from '../models/group.model';
import { EmailTemplates } from './templates';
import { User } from 'src/models/user.model';

@Injectable()
export class EmailService {
  constructor(
    private readonly mailer: MailerService,
    @InjectModel(Student) private readonly studentModel: typeof Student,
    @InjectModel(Group) private readonly groupModel: typeof Group,
    @InjectModel(User) private readonly userModel: typeof User,

  ) {}

  async findGroup(groupId: number): Promise<Group | null> {
    return this.groupModel.findByPk(groupId);
  }

  /**
   * templateKey — один из ключей EmailTemplates  
   * context — для TEST_REMINDER: { subject },  
   *           для EXAM_REMINDER: { subject, datetime }
   */
  async sendGroup(
    groupId: number,
    templateKey: keyof typeof EmailTemplates,
    context: Record<string, any>,
  ) {
    const group = await this.findGroup(groupId);
    if (!group) {
      throw new NotFoundException(`Group with id ${groupId} not found`);
    }

    const students = await this.studentModel.findAll({
      where: { groupId } as any,
    });
    const emails = students.map((student) => {
      const studentData = student.get({ plain: true });
      return studentData.email;
    });

    // Выбираем HTML по ключу
    const templateFn = EmailTemplates[templateKey];
    if (!templateFn) {
      throw new NotFoundException(`Unknown email template "${templateKey}"`);
    }

    // Собираем тему письма
    let mailSubject = 'Уведомление';
    if (templateKey === 'TEST_REMINDER') {
      mailSubject = `Напоминание о тестировании: ${context.subject}`;
    } else if (templateKey === 'EXAM_REMINDER') {
      mailSubject = `Напоминание о экзамене: ${context.subject}`;
    }

    // Рассылаем всем студентам
    await Promise.all(
      emails.map((to) =>
        this.mailer.sendMail({
          to,
          subject: mailSubject,
          html: templateFn(
            context.subject,
            context?.datetime,
          ),
        }),
      ),
    );

    return { sentTo: emails.length };
  }

  async sendToStudent(
    student: Student,
    templateKey: keyof typeof EmailTemplates,
    context: Record<string, any>,
  ) {
    const templateFn = EmailTemplates[templateKey];
    if (!templateFn) {
      throw new NotFoundException(`Unknown email template "${templateKey}"`);
    }

    let mailSubject = 'Уведомление';
    if (templateKey === 'TEST_REMINDER') {
      mailSubject = `Напоминание о тестировании: ${context.subject}`;
    } else if (templateKey === 'EXAM_REMINDER') {
      mailSubject = `Напоминание о экзамене: ${context.subject}`;
    }

    console.log('send')

    return this.mailer.sendMail({
      to: student.email,
      subject: mailSubject,
      html: templateFn(
        context.subject,
        context?.datetime,
      )
    });
  }

  async sendToCurators(
    templateKey: keyof typeof EmailTemplates,
    context: Record<string, any>,
  ) {
    const templateFn = EmailTemplates[templateKey];
    if (!templateFn) {
      throw new NotFoundException(`Unknown email template "${templateKey}"`);
    }

    let mailSubject = 'Уведомление';
    if (templateKey === 'MEETING_REMINDER') {
      mailSubject = `Напоминание о встрече: ${context.subject}`;
    } else if (templateKey === 'DEADLINE_REMINDER') {
      mailSubject = `Напоминание о дедлайне: ${context.subject}`;
    }

    const curators = await this.userModel.findAll({
      where: { role: "curator" }
    })

    const emails = curators.map((curator) => {
      const curatorsData = curator.get({ plain: true });
      return curatorsData.email;
    });

    await Promise.all(
      emails.map((to) =>
        this.mailer.sendMail({
          to,
          subject: mailSubject,
          html: templateFn(
            context.subject,
            context?.datetime,
          ),
        }),
      ),
    );

    return { sentTo: emails.length };
  }

  async sendToCuratorById(
    curatorId: number,
    templateKey: keyof typeof EmailTemplates,
    context: Record<string, any>,
  ) {

    const curator = await this.userModel.findOne({
      where: { id: curatorId }
    });
    if (!curator) {
      throw new NotFoundException(`Curator with id ${curatorId} not found`);
    }

    const templateFn = EmailTemplates[templateKey];
    if (!templateFn) {
      throw new NotFoundException(`Unknown email template "${templateKey}"`);
    }

    let mailSubject = 'Уведомление';
    if (templateKey === 'MEETING_REMINDER') {
      mailSubject = `Напоминание о встрече: ${context.subject}`;
    } else if (templateKey === 'DEADLINE_REMINDER') {
      mailSubject = `Напоминание о дедлайне: ${context.subject}`;
    }

    return this.mailer.sendMail({
      to: curator.email,
      subject: mailSubject,
      html: templateFn(
        context.subject,
        context?.datetime,
      )
    });
  }
  
}