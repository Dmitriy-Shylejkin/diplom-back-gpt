import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  Get,
} from '@nestjs/common';
import { AuthService }       from './auth.service';
import { RegisterDto }       from './dto/register-auth.dto';
import { LoginDto }          from './dto/login-auth.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtAuthGuard }      from './jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly svc: AuthService) {}

  // регистрация — без guard!
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.svc.register(dto);
  }

  // логин — без guard!
  @Post('login')
  login(@Body() dto: LoginDto) {
    console.log('herer', dto)
    return this.svc.login(dto);
  }

  // профиль — защищённым JWT
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  profile(@Req() req) {
    return this.svc.profile(req.user.userId);
  }

  // смена пароля — защищённым JWT
  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  changePassword(@Req() req, @Body() dto: ChangePasswordDto) {
    return this.svc.changePassword(req.user.userId, dto);
  }
}
