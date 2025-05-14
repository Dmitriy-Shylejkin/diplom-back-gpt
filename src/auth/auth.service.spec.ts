import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getModelToken } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import { User } from '../models/user.model';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register-auth.dto';
import { LoginDto } from './dto/login-auth.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;

  const mockUserData = {
    id: 1,
    fullName: 'Test User',
    email: 'test@example.com',
    password: bcrypt.hashSync('password', 10),
    role: 'curator' as const,
    phone: '+71234567890',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Мок-объект Sequelize-инстанса
  const mockUserInstance = {
    ...mockUserData,
    get: jest.fn().mockReturnValue(mockUserData),
    save: jest.fn().mockResolvedValue(undefined),
  };

  const userModelMock = {
    create: jest.fn().mockResolvedValue(mockUserInstance),
    findOne: jest.fn().mockResolvedValue(mockUserInstance),
    findByPk: jest.fn().mockResolvedValue(mockUserInstance),
  };

  const jwtServiceMock = {
    sign: jest.fn().mockReturnValue('mock-token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getModelToken(User), useValue: userModelMock },
        { provide: JwtService, useValue: jwtServiceMock },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('должен быть определён', () => {
    expect(service).toBeDefined();
  });

  it('регистрирует пользователя', async () => {
    const dto: RegisterDto = {
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'password',
      role: 'curator',
      phone: '+71234567890',
    };
    const result = await service.register(dto);
    expect(result).toEqual(
      expect.objectContaining({
        id: mockUserData.id,
        fullName: mockUserData.fullName,
        email: mockUserData.email,
        role: mockUserData.role,
        phone: mockUserData.phone,
      }),
    );
    expect(userModelMock.create).toHaveBeenCalledWith(
      expect.objectContaining({
        fullName: dto.fullName,
        email: dto.email,
        role: dto.role,
        phone: dto.phone,
      }),
    );
  });

  it('логинится и возвращает токен', async () => {
    const dto: LoginDto = { email: 'test@example.com', password: 'password' };
    const result = await service.login(dto);
    expect(result).toEqual({ access_token: 'mock-token' });
    expect(userModelMock.findOne).toHaveBeenCalledWith({
      where: { email: dto.email },
    });
  });

  it('возвращает профиль', async () => {
    const result = await service.profile(1);
    expect(result).toEqual(
      expect.objectContaining({
        id: mockUserData.id,
        email: mockUserData.email,
        fullName: mockUserData.fullName,
        role: mockUserData.role,
        phone: mockUserData.phone,
      }),
    );
    expect(userModelMock.findByPk).toHaveBeenCalledWith(
      1,
      expect.any(Object),
    );
  });

  it('меняет пароль', async () => {
    const dto: ChangePasswordDto = {
      oldPassword: 'password',
      newPassword: 'newpass123',
    };
    const res = await service.changePassword(1, dto);
    expect(res).toEqual({ message: 'Пароль успешно изменён' });
    expect(mockUserInstance.save).toHaveBeenCalled();
  });

  it('брасывает ошибку при неверном старом пароле', async () => {
    // Спайим промисный compare
    const compareMock = jest.spyOn(bcrypt, 'compare') as any;
    compareMock.mockResolvedValueOnce(false);

    // Ожидаем UnauthorizedException
    await expect(
      service.changePassword(
        1,
        { oldPassword: 'wrong', newPassword: 'whatever' },
      ),
    ).rejects.toThrow(UnauthorizedException);
  });
});
