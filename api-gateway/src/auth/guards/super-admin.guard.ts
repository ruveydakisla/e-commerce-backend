
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRole } from 'src/users/utils/types';
import { RequestWithUser } from '../utils/types';

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
