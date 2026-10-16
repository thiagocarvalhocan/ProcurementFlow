import { inject } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthSessionService } from '../core/auth/auth-session.service';
import { UserPermissionService } from '../services/user-permission.service';

const LOGIN_ROUTE = '/auth/login';

/**
 * Attaches the mock bearer token to every outgoing request and reacts to
 * authentication/authorization failures returned by the fake API.
 */
export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const authSessionService = inject(AuthSessionService);
  const router = inject(Router);
  const userPermissionService = inject(UserPermissionService);

  const token = authSessionService.token;

  const authReq = token
    ? req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`),
      })
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        console.log('Not authorized');
        userPermissionService.clearCurrentUser();
        authSessionService.clear();
        router.navigate([LOGIN_ROUTE]).then((r) => console.log(r));
      } else if (error.status === 403) {
        alert(userPermissionService.getMessageUserWithoutPermission());
      }

      return throwError(() => error);
    })
  );
};

