import { IsArray, IsInt } from 'class-validator';

export class AddSubjectsToProgramDto {

  @IsArray()
  @IsInt({ each: true })
  subjectIds: number[];
}