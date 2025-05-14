import { PartialType } from '@nestjs/mapped-types';
import { CreateCuratorDto } from './create-curator.dto';

export class UpdateCuratorDto extends PartialType(CreateCuratorDto) {}