import { IsEnum, IsOptional } from 'class-validator';
import { Role } from '../../core/enums/role.enum.js';

export class UpdateUserRoleDto {
  @IsOptional()
  @IsEnum(Role, { each: true })
  role: Role;
}
