import { AUTH_PATTERNS } from '@my/common';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    @Inject('AUTH_MICROSERVICE') private readonly authMicroservice: ClientProxy,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const authHeader = req.headers.authorization;

    if (!authHeader) return false;

    const token = authHeader.replace('Bearer ', '');
    try {
      const user = await firstValueFrom(
        this.authMicroservice.send({ cmd: AUTH_PATTERNS.verify }, token),
      );

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
