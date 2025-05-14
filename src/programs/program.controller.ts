import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ProgramService } from './program.service';
import { CreateProgramDto } from './dto/create-program.dto';
import { UpdateProgramDto } from './dto/update-program.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('programs')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProgramController {
  constructor(private readonly service: ProgramService) {}

  @Post()
  @Roles('admin')
  create(@Body() dto: CreateProgramDto) {
    return this.service.create(dto);
  }

  @Get()
  @Roles('admin', 'curator')
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @Roles('admin', 'curator')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @Roles('admin')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProgramDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
