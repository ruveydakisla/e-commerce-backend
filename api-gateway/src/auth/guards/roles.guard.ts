import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from 'src/users/entities/user.entity';
import { UserRole } from 'src/users/utils/types';
import { ROLES_KEY } from '../decorator/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    console.log(requiredRoles);

    if (!requiredRoles) return true;
    const { user } = context
      .switchToHttp()
      .getRequest<Request & { user: User }>();
    console.log(user);

    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException('Yetkiniz bulunmamaktadır.');
    }
    return true;
  }
}
