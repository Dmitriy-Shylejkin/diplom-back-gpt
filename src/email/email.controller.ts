import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { EmailService } from './email.service';
import { SendEmailDto } from './dto/send-email.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { AuthRequest } from '../auth/auth.types';

@Controller('email')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EmailController {
  constructor(private readonly service: EmailService) {}

  @Post('send-group')
  @Roles('admin', 'curator')
  async sendGroup(
    @Body() dto: SendEmailDto,
    @Req() req: AuthRequest,
  ) {
    if (req.user.role === 'curator') {
      const group = await this.service.findGroup(dto.groupId);
      if (!group || group.curatorId !== req.user.id) {
        throw new ForbiddenException();
      }
    }
    return this.service.sendGroup(
      dto.groupId,
      dto.templateKey,
      dto.context,
    );
  }
}
