import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  RequestTimeoutException,
  Logger,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class RestInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();

    return next.handle().pipe(
      tap((data) => {
        if (data === undefined) throw new NotFoundException();
        console.log(`Request processed in ${Date.now() - now}ms`);
      }),
      catchError((err) => {
        Logger.error(err);
        if (err instanceof TimeoutError) {
          return throwError(() => new RequestTimeoutException());
        }
        if (err instanceof TypeError) {
          return throwError(
            () =>
              new HttpException(
                'Value is out of domain',
                HttpStatus.BAD_REQUEST,
                { cause: new Error('Incorrect chore place') },
              ),
          );
        }
      }),
    );
  }
}
