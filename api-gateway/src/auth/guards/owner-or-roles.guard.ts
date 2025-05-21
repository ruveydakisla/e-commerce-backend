import { RequestWithUser } from '@my/common/src/auth/types';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from 'src/users/utils/types';
import { ROLES_KEY } from '../decorator/roles.decorator';

@Injectable()
export class OwnerOrRolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;
    const paramId = Number(request.params.id);

    if (!user) throw new ForbiddenException('Kullanıcı doğrulanamadı');

    const allowedRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    const isRoleAllowed = user.role && allowedRoles?.includes(user.role);
    const isOwner = user.id === paramId;

    if (isOwner || isRoleAllowed) {
      return true;
    }

    throw new ForbiddenException(
      'Bu işlemi yapmak için yetkiniz bulunmamaktadır.',
    );
  }
}
