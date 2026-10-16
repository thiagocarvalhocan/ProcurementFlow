import { inject } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpInterceptorFn,
  HttpResponse,
} from '@angular/common/http';
import { Observable, delay, of, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthSessionService } from '../core/auth/auth-session.service';
import {
  buildMockRequestContext,
  handleMockApiRequest,
  isMockApiUrl,
} from '../core/mock-api/mock-api.handlers';

const MOCK_LATENCY_MILLISECONDS = 250;

/**
 * Mock API Interceptor
 *
 * Every request aimed at the legacy backend is answered locally by the
 * in-memory mock database, so the application runs completely offline.
 * It is enabled while `environment.auth.provider` is the mock provider.
 */
export const mockApiInterceptor: HttpInterceptorFn = (
  req,
  next
): Observable<HttpEvent<unknown>> => {
  const offlineBuild = environment.auth.provider === 'mock';

  if (!offlineBuild || !isMockApiUrl(req.url)) {
    return next(req);
  }

  const authSessionService = inject(AuthSessionService);
  const context = buildMockRequestContext(req);

  context.currentUser = authSessionService.currentUser;

  const response = handleMockApiRequest(context);

  if (response.status >= 400) {
    return throwError(
      () =>
        new HttpErrorResponse({
          url: req.url,
          status: response.status,
          statusText: String((response.body as { message?: string })?.message ?? ''),
          error: response.body,
        })
    );
  }

  return of(
    new HttpResponse<unknown>({
      status: response.status,
      body: response.body ?? null,
    })
  ).pipe(delay(MOCK_LATENCY_MILLISECONDS));
};


