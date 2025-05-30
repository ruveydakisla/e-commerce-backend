import { SERVICES } from '@my/common';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
  ) {}

  async verify(token: string) {
    try {
      console.log('auth microservice verify token', token);
      const verified = await this.jwtService.verify(token);
      return verified;
    } catch (e) {
      console.log('jwt verify hatası', e);

      return { message: 'jwt verify hatası', error: e };
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
      console.log('auth hatası:', error);

      return false;
    }
  }
}
