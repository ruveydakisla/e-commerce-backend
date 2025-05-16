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
  constructor(@Inject('AUTH_SERVICE') private authMicroservice: ClientProxy) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers.authorization;
    if (!authHeader) return false;

    const token = authHeader.replace('Bearer ', '');
    try {
      const user = await firstValueFrom(
        this.authMicroservice.send({ cmd: 'auth.verify' }, { token }),
      );
      req.user = user;
      return true;
    } catch (error) {
      return false;
    }
  }
}
