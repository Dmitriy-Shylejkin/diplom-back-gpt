import {
  Controller,
  Post,
  Param,
  Body,
  ParseIntPipe,
  ParseArrayPipe,
  UseGuards,
} from '@nestjs/common';
import { CuratorService } from './curator.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('curators')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CuratorController {
  constructor(private readonly curatorService: CuratorService) {}

  @Post(':id/groups')
  @Roles('admin')
  assignGroups(
    @Param('id', ParseIntPipe) curatorId: number,
    @Body(
      'groupIds',
      new ParseArrayPipe({ items: Number, separator: ',' }),
    )
    groupIds: number[],
  ) {
    return this.curatorService.assignGroups(curatorId, groupIds);
  }
}
