import { RequestWithUser } from '@my/common/src/auth/types';
import { UserRole } from '@my/common/src/users/constants';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class SuperAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;
    if (!user) {
      throw new UnauthorizedException('Kullanıcı bilgisi bulunamadı.');
    }

    if (user.role === UserRole.SUPER_ADMIN) {
      return true;
    }
    throw new UnauthorizedException(
      'Bu işlem için Süper Admin yetkisi gereklidir.',
    );
  }
}
