import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  /** 
   * Admin: получить всех кураторов с их группами 
   */
  @Get('curators')
  @Roles('admin')
  findAllCurators() {
    return this.userService.findAllCuratorsWithGroups();
  }

  /**
   * Admin: получить одного куратора по ID с группами
   */
  @Get('curators/:id')
  @Roles('admin')
  findOneCurator(
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.userService.findOneCuratorWithGroups(id);
  }
}
