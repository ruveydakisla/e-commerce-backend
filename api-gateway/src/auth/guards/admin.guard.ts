// src/auth/guards/admin.guard.ts

import { RequestWithUser } from '@my/common/src/auth/types';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRole } from 'src/users/utils/types';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;
    if (!user) {
      throw new UnauthorizedException('Kullanıcı bilgisi bulunamadı.');
    }

    if (user.role === UserRole.ADMIN) {
      return true;
    }
    throw new UnauthorizedException(
      'Bu işlem için Süper Admin yetkisi gereklidir.',
    );
  }
}
