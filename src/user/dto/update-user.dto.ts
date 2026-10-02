import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto.js';
import { IsEnum, IsOptional } from 'class-validator';
import { Role } from '../../core/enums/role.enum.js';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsEnum(Role, { each: true })
  role: Role;
}
