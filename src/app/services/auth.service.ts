import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthSessionService } from '../core/auth/auth-session.service';
import { FakeAuthApiService } from '../core/auth/fake-auth-api.service';
import { AuthSession } from '../core/auth/models/auth-session';
import { AuthenticatedUser } from '../core/auth/models/authenticated-user';
import { LoginCredentials } from '../core/auth/models/login-credentials';
import { UserPermissionService } from './user-permission.service';

const UNKNOWN_USER_NAME = 'Unknown user';

/**
 * Orchestrates the local (mock) authentication flow:
 * validates credentials through the fake API, persists the session and
 * keeps the permission engine in sync with the authenticated user.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly loginRoute = '/auth/login';
  readonly homeRoute = '/';
  readonly messageUserNotAuthorized =
    'Your account has no access to this system. Please request access to the administrator.';

  constructor(
    private router: Router,
    private authSessionService: AuthSessionService,
    private fakeAuthApiService: FakeAuthApiService,
    private userPermissionService: UserPermissionService
  ) {}

  login(credentials: LoginCredentials): Observable<AuthSession> {
    return this.fakeAuthApiService.login(credentials).pipe(
      tap((session) => this.applySession(session))
    );
  }

  /**
   * Restores a session persisted in a previous visit (for example after a
   * page reload) and reattaches the user to the permission engine.
   */
  restoreSession(): boolean {
    const session = this.authSessionService.currentSession;

    if (!session) {
      return false;
    }

    this.userPermissionService.setCurrentUser(session.user);
    return true;
  }

  isAuthenticated(): boolean {
    const session = this.authSessionService.currentSession;

    if (!session) {
      return false;
    }

    const currentUser = this.userPermissionService.getCurrentUser();

    if (!currentUser || currentUser.id !== session.user.id) {
      this.userPermissionService.setCurrentUser(session.user);
    }

    return true;
  }

  logout(): void {
    this.userPermissionService.clearCurrentUser();
    this.authSessionService.clear();
    this.goToLogin();
  }

  goToLogin(): void {
    this.router
      .navigate([this.loginRoute])
      .then(() => console.log('redirected to login'));
  }

  goToHome(): void {
    this.router
      .navigate([this.homeRoute])
      .then(() => console.log('redirected to home'));
  }

  getCurrentUser(): AuthenticatedUser | null {
    return this.authSessionService.currentUser;
  }

  getToken(): string | null {
    return this.authSessionService.token;
  }

  getUserName(): string {
    return this.authSessionService.currentUser?.name ?? UNKNOWN_USER_NAME;
  }

  getUserEmail(): string {
    return this.authSessionService.currentUser?.email ?? '';
  }

  private applySession(session: AuthSession): void {
    this.authSessionService.save(session);
    this.userPermissionService.setCurrentUser(session.user);
  }
}
