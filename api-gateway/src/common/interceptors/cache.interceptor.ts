import { RequestWithUser, UserRole } from '@my/common';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { ExecutionContext, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class CustomCacheInterceptor extends CacheInterceptor {
  private readonly logger = new Logger(CustomCacheInterceptor.name);

  protected getCacheKey(context: ExecutionContext): string {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const queryParams = Object.keys(request.query)
      .sort()
      .map((key) => `${key}=${request.query[key]}`)
      .join('&');
    const key = `${request.path}${queryParams ? '?' + queryParams : ''}`;

    this.logger.log(`Cache key generated: ${key}`);
    return key;
  }

  protected getTtl(context: ExecutionContext): number | undefined {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const ttl =
      request.user?.role === UserRole.ADMIN ? 60000 : 300000;

    this.logger.log(
      `Cache TTL set to ${ttl / 1000}s for role: ${
        request.user?.role ?? 'GUEST'
      }`,
    );
    return ttl;
  }
}
