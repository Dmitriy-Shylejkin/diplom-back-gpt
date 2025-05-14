import { IsEmail, IsEnum, IsNotEmpty, MinLength, IsPhoneNumber } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  fullName: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsEnum(['admin', 'curator'], { message: 'Роль должна быть admin или curator' })
  role: 'admin' | 'curator';

  @IsPhoneNumber('RU', { message: 'Неверный формат телефона' })
  phone: string;
}
