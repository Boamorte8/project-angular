import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';

import { AuthService } from '../auth/auth.service';

@Injectable()
export class LoggingInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('Intercepted!', req);
    return next.handle(req).pipe(tap(
      event => {
        console.log('Logging interceptor', event);
      }
    ));
  }
}
