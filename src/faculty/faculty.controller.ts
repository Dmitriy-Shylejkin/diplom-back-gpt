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
  Req,
  HttpCode,
} from '@nestjs/common';
import { FacultyService } from './faculty.service';
import { CreateFacultyDto } from './dto/create-faculty.dto';
import { UpdateFacultyDto } from './dto/update-faculty.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard }   from '../auth/roles.guard';
import { Roles }        from '../auth/roles.decorator';

@Controller('faculties')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FacultyController {
  constructor(private readonly service: FacultyService) {}

  @Post()
  @Roles('admin')
  async create(@Req() req, @Body() dto: CreateFacultyDto) {
    // можно раскомментить для дебага:
    // console.log('USER in create()', req.user);
    return this.service.create(dto);
  }

  @Get()
  @HttpCode(200)
  @Roles('admin', 'curator')
  findAll(@Req() req) {
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
    @Body() dto: UpdateFacultyDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
