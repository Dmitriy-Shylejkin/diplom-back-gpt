import { IsInt, IsEnum } from 'class-validator';
import { GradeEnum } from '../grade.enum';

export class CreateGradeDto {
  @IsInt()
  studentId: number;

  @IsInt()
  subjectId: number;

  @IsEnum(GradeEnum)
  grade: GradeEnum;
}
