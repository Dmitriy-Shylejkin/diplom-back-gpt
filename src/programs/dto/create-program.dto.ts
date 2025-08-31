import { IsNotEmpty, IsString, IsOptional, IsNumber, IsArray, IsInt } from 'class-validator';
import { IsArrayOfIds } from '../decorators/is-array-of-ids.decorator';

export class CreateProgramDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  shortName: string;

  @IsInt()
  @IsNotEmpty()
  facultyId: number;

  @IsArrayOfIds()
  @IsOptional()
  subjectIds?: number[];
}
