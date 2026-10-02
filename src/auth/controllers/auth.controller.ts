import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service.js';
import { LocalAuthGuard } from '../guards/local-auth/local-auth.guard.js';
import { Public } from '../../core/decorators/public.decorator.js';
import { CurrentUser } from '../../core/decorators/current-user.decorator.js';
import { CreateUserDto } from '../../user/dto/create-user.dto.js';
import { VerifyOtpDto } from '../dto/verify-otp.dto.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@CurrentUser() current: { id: number }) {
    return this.authService.login(current);
  }

  @Public()
  @Post('register')
  async register(@Body() dto: CreateUserDto) {
    return this.authService.register(dto);
  }

  @Public()
  @Post('verify-otp')
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.authService.verifyOtpAndLogin(verifyOtpDto);
  }
}
