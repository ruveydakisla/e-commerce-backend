import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Request } from 'express';
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class TransformResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();

    return next.handle().pipe(
      map((data) => ({
        success: true,
        timestamp: new Date().toISOString(),
        path: request.url,
        data,
      })),
      catchError((err) => {
        const status =
          err instanceof HttpException
            ? err.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;

        const responseMessage =
          err instanceof HttpException ? err.getResponse() : err;

        const message =
          typeof responseMessage === 'string'
            ? responseMessage
            : (responseMessage as any)?.message || 'Internal server error';

        return throwError(() => ({
          statusCode: status,
          success: false,
          timestamp: new Date().toISOString(),
          path: request.url,
          message,
        }));
      }),
    );
  }
}
