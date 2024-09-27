import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  RequestTimeoutException,
  Logger,
} from '@nestjs/common';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class RestInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    console.log(`Request recieved at ${now}`);

    return next.handle().pipe(
      tap(() => console.log(`Request processed in ${Date.now() - now}ms`)),
      catchError((err) => {
        Logger.error(err);
        if (err instanceof TimeoutError) {
          return throwError(() => new RequestTimeoutException());
        }
      }),
    );
  }
}
