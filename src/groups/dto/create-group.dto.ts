import { IsString, IsInt, Min } from 'class-validator';

export class CreateGroupDto {
  @IsString()
  name: string;

  @IsInt()
  programId: number;

  @IsInt()
  @Min(1)
  curatorId: number;
}
