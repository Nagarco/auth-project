import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../services/user.service.js';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth/jwt-auth.guard.js';
import { Roles } from '../../core/decorators/roles.decorator.js';
import { Role } from '../../core/enums/role.enum.js';
import { RolesGuard } from '../../core/guards/roles.guard.js';
import { UpdateUserRoleDto } from '../dto/update-role.dto.js';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile/:id')
  async profile(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findById(id);
  }

  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  @Put('role/:id')
  async updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserRoleDto,
  ) {
    return this.userService.update(id, dto);
  }

  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.delete(id);
  }
}
