import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthSession } from './models/auth-session';
import { AuthenticatedUser } from './models/authenticated-user';

/**
 * Single owner of the authenticated session.
 * The session is kept in memory and mirrored into sessionStorage, so a
 * page reload keeps the user logged in for the current browser tab.
 * Reading the session never creates a user: it returns null when there is
 * no valid session stored.
 */
@Injectable({ providedIn: 'root' })
export class AuthSessionService {
  private readonly storageKey = environment.auth.sessionKey;
  private session: AuthSession | null = null;
  private readonly sessionSubject = new BehaviorSubject<AuthSession | null>(
    null
  );

  readonly session$: Observable<AuthSession | null> =
    this.sessionSubject.asObservable();

  get currentSession(): AuthSession | null {
    return this.readStoredSession();
  }

  get currentUser(): AuthenticatedUser | null {
    return this.currentSession?.user ?? null;
  }

  get token(): string | null {
    return this.currentSession?.token ?? null;
  }

  isAuthenticated(): boolean {
    return this.currentSession !== null;
  }

  save(session: AuthSession): void {
    this.session = session;
    sessionStorage.setItem(this.storageKey, JSON.stringify(session));
    this.sessionSubject.next(session);
  }

  clear(): void {
    this.session = null;
    sessionStorage.removeItem(this.storageKey);
    this.sessionSubject.next(null);
  }

  private readStoredSession(): AuthSession | null {
    if (this.session) {
      return this.session;
    }

    const stored = sessionStorage.getItem(this.storageKey);
    if (!stored) {
      return null;
    }

    try {
      const session = JSON.parse(stored) as AuthSession;

      if (!this.isValid(session)) {
        this.clear();
        return null;
      }

      this.session = session;
      this.sessionSubject.next(session);
      return session;
    } catch {
      this.clear();
      return null;
    }
  }

  private isValid(session: AuthSession): boolean {
    return Boolean(
      session?.token && session?.user && session.expiresAt > Date.now()
    );
  }
}
