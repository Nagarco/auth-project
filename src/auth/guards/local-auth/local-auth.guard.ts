import {
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { User } from '../../../user/entities/user.entity.js';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  private readonly logger = new Logger(LocalAuthGuard.name);

  handleRequest<TUser>(
    err: unknown,
    user: TUser,
    info: { message?: string } | undefined,
    context: ExecutionContext,
  ): TUser {
    const req = context.switchToHttp().getRequest<Request>();
    const ip = req.ip;

    if (err || !user) {
      const reason =
        (err as Error | undefined)?.message ?? info?.message ?? 'Unknown';
      this.logger.warn(`Login failed | ip=${ip} | reason=${reason}`);
      throw err ?? new UnauthorizedException('Invalid credentials');
    }

    const { id } = user as unknown as Pick<User, 'id'>;

    this.logger.log(`Login succeeded | userId=${id} | ip=${ip}`);

    return user;
  }
}
