import { Injectable } from '@angular/core';
import { Observable, delay, of, throwError } from 'rxjs';
import { AuthSession } from './models/auth-session';
import { AuthenticatedUser } from './models/authenticated-user';
import { AuthenticationError } from './models/authentication-error';
import { LoginCredentials } from './models/login-credentials';
import { MOCK_ACCOUNTS } from './mock-auth-data';

const SESSION_DURATION_MINUTES = 60;
const SIMULATED_LATENCY_MILLISECONDS = 450;

/**
 * Local replacement for the authentication endpoint.
 * Validates credentials against the demo accounts and returns a session
 * with a mock bearer token. It never touches HttpClient or the network.
 */
@Injectable({ providedIn: 'root' })
export class FakeAuthApiService {
  login(credentials: LoginCredentials): Observable<AuthSession> {
    const email = (credentials?.email ?? '').trim().toLowerCase();
    const password = credentials?.password ?? '';

    if (!email || !password) {
      return throwError(
        () => new AuthenticationError('Please enter your e-mail and password.')
      );
    }

    const account = MOCK_ACCOUNTS.find((item) => item.email === email);

    if (!account || account.password !== password) {
      return throwError(
        () => new AuthenticationError('Invalid e-mail or password.')
      );
    }

    return of(this.createSession(account.user)).pipe(
      delay(SIMULATED_LATENCY_MILLISECONDS)
    );
  }

  private createSession(user: AuthenticatedUser): AuthSession {
    const issuedAt = Date.now();
    const expiresAt = issuedAt + SESSION_DURATION_MINUTES * 60 * 1000;

    return {
      user,
      token: this.createMockToken(user, expiresAt),
      issuedAt,
      expiresAt,
    };
  }

  /**
   * Builds an unsigned JWT-shaped token so the UI can read a realistic
   * bearer value without relying on a real identity provider.
   */
  private createMockToken(user: AuthenticatedUser, expiresAt: number): string {
    const header = this.encodeSegment({ alg: 'none', typ: 'JWT' });
    const payload = this.encodeSegment({
      sub: String(user.id),
      name: user.name,
      email: user.email,
      employee_id: user.employeeId,
      unit_id: user.unitId,
      exp: Math.floor(expiresAt / 1000),
    });

    return `${header}.${payload}.mock-signature`;
  }

  private encodeSegment(value: Record<string, unknown>): string {
    return btoa(JSON.stringify(value))
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  }
}
