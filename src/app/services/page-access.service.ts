import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';

/**
 * Keeps track of page access. The legacy SignalR hub is gone: the entry and
 * release calls are answered locally by the mock API, so the service only
 * needs to expose the same surface the components already use.
 */
@Injectable({
  providedIn: 'root'
})
export class PageAccessService implements OnDestroy {
  private apiUrl = `${environment.api.uriv0}page-access`;

  private pageInUseSubject = new Subject<string>();
  private accessGrantedSubject = new Subject<void>();

  constructor(private http: HttpClient) {}

  /** The mock layer has no exclusive page locking, so access is always granted. */
  public enterPage(pageName: string, userId: string): void {
    this.accessGrantedSubject.next();
  }

  public leavePage(pageName: string, userId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/leave`, { pageName, userId });
  }

  public onPageInUse(): Observable<string> {
    return this.pageInUseSubject.asObservable();
  }

  public onAccessGranted(): Observable<void> {
    return this.accessGrantedSubject.asObservable();
  }

  public stopConnection(): void {
    // No live connection to close in the offline build.
  }

  ngOnDestroy(): void {
    this.stopConnection();
  }
}
