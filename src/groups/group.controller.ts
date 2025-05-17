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
  Query
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

@Controller('groups')
@UseGuards(JwtAuthGuard, RolesGuard)
export class GroupController {
  constructor(private readonly svc: GroupService) {}

  @Post()
  @Roles('admin')
  create(@Body() dto: CreateGroupDto) {
    return this.svc.create(dto);
  }

  @Get()
  @Roles('admin', 'curator')
  findAll(
    @Req() req, 
    @Query() query: { programId?: number; }
  ) {
    return this.svc.findAll(req.user, query.programId);
  }

  @Get(':id')
  @Roles('admin', 'curator')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.svc.findOne(id);
  }

  @Put(':id')
  @Roles('admin')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateGroupDto,
  ) {
    return this.svc.update(id, dto);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.svc.remove(id);
  }
}
