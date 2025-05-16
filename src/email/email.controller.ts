import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { EmailService } from './email.service';
import { SendEmailDto } from './dto/send-email.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { AuthRequest } from '../auth/auth.types';
import { StudentService } from 'src/students/student.service';
import { SendEmailToStudentDto } from './dto/send-email-to-student.dto';
import { SendEmailToCuratorByIdDto, SendEmailToCuratorsDto } from './dto/send-email-to-curators.dto';

@Controller('email')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EmailController {
  constructor(
    private readonly service: EmailService,
    private readonly studentService: StudentService
  ) {}

  @Post('send-group')
  @Roles('curator')
  async sendGroup(
    @Body() dto: SendEmailDto,
    @Req() req: AuthRequest,
  ) {
    console.log(req.user)
    if (req.user.role === 'curator') {
      const group = await this.service.findGroup(dto.groupId);
      if (!group || group.curatorId !== req.user.userId) {
       
        throw new ForbiddenException();
      }
    }
    return this.service.sendGroup(
      dto.groupId,
      dto.templateKey,
      dto.context,
    );
  }

  @Post('send-student')
  @Roles('curator')
  async sendToStudent(
    @Body() dto: SendEmailToStudentDto,
    @Req() req: AuthRequest,
  ) {
    if (req.user.role === 'curator') {
      const student = await this.studentService.findOne(dto.studentId);
      if (!student) {
        throw new NotFoundException(`Student with id ${dto.studentId} not found`);
      }
    
    return this.service.sendToStudent(
      student,
      dto.templateKey,
      dto.context,
    );
    }
  }

  @Post('send-curators')
  @Roles('admin')
  async sendToCurators(
    @Body() dto: SendEmailToCuratorsDto,
    @Req() req: AuthRequest,
  ) {
    if (req.user.role === 'admin') {
    
    return this.service.sendToCurators(
      dto.templateKey,
      dto.context,
    );
    }
  }

  @Post('send-curator/')
  @Roles('admin')
  async sendToCuratorById(
    @Body() dto: SendEmailToCuratorByIdDto,
    @Req() req: AuthRequest,
  ) {
    if (req.user.role === 'admin') {
    
    return this.service.sendToCuratorById(
      dto.curatorId,
      dto.templateKey,
      dto.context,
    );
    }
  }
}
