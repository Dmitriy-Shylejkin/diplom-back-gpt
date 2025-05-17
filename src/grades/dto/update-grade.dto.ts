import { PartialType } from '@nestjs/mapped-types';
import { CreateGradeDto } from './create-grade.dto';
import { IsEnum } from 'class-validator';
import { GradeEnum } from '../grade.enum';

export class UpdateGradeDto {
  @IsEnum(GradeEnum)
  grade: GradeEnum;
}
