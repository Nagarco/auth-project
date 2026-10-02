import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../user/services/user.service.js';
import { CreateUserDto } from '../../user/dto/create-user.dto.js';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { VerifyOtpDto } from '../dto/verify-otp.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) { }

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmailWithPassword(email);
    if (!user) return null;

    const isPasswordMatching = await compare(password, user.password);
    if (!isPasswordMatching) return null;

    return user;
  }

  login(user: { id: number }) {
    const payload = { sub: user.id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(dto: CreateUserDto): Promise<{ message: string }> {
    const pendingUser = await this.userService.createUserObject(dto);
    await this.cacheManager.set(`pending_user:${dto.email}`, pendingUser);

    return {
      message: 'Registration initiated. Please check your email for the OTP.',
    };
  }

  async verifyOtpAndLogin(dto: VerifyOtpDto) {
    if (dto.otp !== '0000') {
      throw new UnauthorizedException('Invalid OTP');
    }

    const pendingUser: CreateUserDto | undefined = await this.cacheManager.get(
      `pending_user:${dto.email}`,
    );

    if (!pendingUser) {
      throw new BadRequestException('OTP expired or email not found');
    }

    const user = await this.userService.create(pendingUser);

    await this.cacheManager.del(`pending_user:${dto.email}`);

    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user: { id: user.id, email: user.email },
    };
  }
}
