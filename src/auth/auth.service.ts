import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { User } from '../models/user.model';
import { RegisterDto } from './dto/register-auth.dto';
import { LoginDto } from './dto/login-auth.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
    private readonly jwtService: JwtService,
  ) {}

  // Регистрация
  async register(dto: RegisterDto) {
    const hash = await bcrypt.hash(dto.password, 10);
    try {
      const user = await this.userModel.create({
        fullName: dto.fullName,
        email: dto.email,
        password: hash,
        role: dto.role,
        phone: dto.phone,
      } as any);
      const { password, ...result } = user.get({ plain: true });
      return result;
    } catch (e) {
      if (e.name === 'SequelizeUniqueConstraintError') {
        throw new ConflictException('Email или телефон уже заняты');
      }
      throw e;
    }
  }

  // Логин
  async login(dto: LoginDto) {
    const user = await this.userModel.findOne({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Неверные учётные данные');
    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Неверные учётные данные');

    const payload = { userId: user.id, email: user.email, role: user.role };
    return { access_token: this.jwtService.sign(payload) };
  }

  // Профиль
  async profile(userId: number) {
    const user = await this.userModel.findByPk(userId, {
      attributes: ['id', 'fullName', 'email', 'role', 'phone', 'createdAt', 'updatedAt'],
    });
    if (!user) throw new UnauthorizedException();
    return user;
  }

  // Смена пароля
  async changePassword(userId: number, dto: ChangePasswordDto) {
    const user = await this.userModel.findByPk(userId);
    if (!user) throw new UnauthorizedException();
    const ok = await bcrypt.compare(dto.oldPassword, user.password);
    if (!ok) throw new UnauthorizedException('Старый пароль неверен');
    user.password = await bcrypt.hash(dto.newPassword, 10);
    await user.save();
    return { message: 'Пароль успешно изменён' };
  }
}
