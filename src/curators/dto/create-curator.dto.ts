import { IsEmail, IsEnum, IsNotEmpty, MinLength, IsPhoneNumber } from 'class-validator';

export class CreateCuratorDto {
  @IsNotEmpty()
  fullName: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsPhoneNumber('RU', { message: 'Неверный формат телефона' })
  phone: string;
}
