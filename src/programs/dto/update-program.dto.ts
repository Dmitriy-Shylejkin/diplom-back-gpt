import { PartialType } from '@nestjs/mapped-types';
import { CreateProgramDto } from './create-program.dto';
import { IsArrayOfIds } from '../decorators/is-array-of-ids.decorator';
import { IsOptional } from 'class-validator';

export class UpdateProgramDto extends PartialType(CreateProgramDto) {
  @IsArrayOfIds()
  @IsOptional()
  subjectIds?: never; 
}
