import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
  } from '@nestjs/common';
  import { Observable } from 'rxjs';
  import { map, catchError } from 'rxjs/operators';
  import { HttpException, HttpStatus } from '@nestjs/common';
  
  @Injectable()
  export class ResponseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const ctx = context.switchToHttp();
      const response = ctx.getResponse();
  
      return next.handle().pipe(
        map((data) => {
          if (data?.success !== undefined) return data;
  
          return {
            success: true,
            message: data?.message || 'Request successful',
            data: data?.data ?? data,
          };
        }),
  
        catchError((error) => {
          let status = HttpStatus.INTERNAL_SERVER_ERROR;
          let message = 'Something went wrong';
  
          if (error instanceof HttpException) {
            status = error.getStatus();
            message = error.getResponse()['message'] || error.message;
          }
  
          response.status(status);
  
          return new Observable((observer) => {
            observer.next({
              success: false,
              message,
              data: null,
            });
            observer.complete();
          });
        }),
      );
    }
  }
  