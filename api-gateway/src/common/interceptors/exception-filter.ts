import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : null;

    let message: string | string[] = 'Internal server error';
    let error: any = exception instanceof Error ? exception.stack : exception;

    if (exceptionResponse && typeof exceptionResponse === 'object') {
      if ('error' in exceptionResponse) {
        const errorField = (exceptionResponse as any).error;

        if (
          typeof errorField === 'object' &&
          errorField !== null &&
          'message' in errorField
        ) {
          // errorField has a message property
          message = errorField.message || (exceptionResponse as any).message || message;

          // error'yi sadeleştiriyoruz, örn: sadece string veya object yapabilirsin
          error = typeof errorField === 'object' ? errorField : error;
        } else {
          // error field is string or no message property
          message =
            (exceptionResponse as any).message ||
            (typeof errorField === 'string' ? errorField : message);
          error = exception instanceof Error ? exception.stack : exception;
        }
      } else if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
        error = exception instanceof Error ? exception.stack : exception;
      } else if ('message' in exceptionResponse) {
        message = (exceptionResponse as any).message || message;
        error = exception instanceof Error ? exception.stack : exception;
      }
    }



    response.status(status).json({
      success: false,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}
