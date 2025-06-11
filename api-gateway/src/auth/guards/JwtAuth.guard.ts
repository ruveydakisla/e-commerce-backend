import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly logger: Logger,
  ) {}

  async verify(token: string) {
    try {
      const verified = await this.jwtService.verify(token);
      return verified;
    } catch (e) {
      return { message: 'jwt verify error', error: e };
    }
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const authHeader = req.headers.authorization;

    if (!authHeader) return false;

    const token = authHeader.replace('Bearer ', '');
    try {
      const user = await this.verify(token);

      if ((req.user = user)) return true;
      else {
        return false;
      }
    } catch (error) {
      this.logger.error('JWT verification error:', error);
      return false;
    }
  }
}
