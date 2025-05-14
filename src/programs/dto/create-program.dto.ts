import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateProgramDto {
  [key: string | symbol]: any;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  shortName?: string;

  @IsNotEmpty()
  @IsNumber()
  facultyId: number;
}
