import { IsString, IsNotEmpty, IsEmail, IsPhoneNumber, IsNumber } from 'class-validator';

export class CreateStudentDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsEmail()
  email: string;

  @IsPhoneNumber('RU') // можно заменить на 'any' если универсально
  phone: string;

  @IsNumber()
  groupId: number;
}
