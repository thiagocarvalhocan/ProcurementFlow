import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class PageAccessService implements OnDestroy {
  private apiUrl = `${environment.api.uriv0}page-access`;

  private pageInUseSubject = new Subject<string>();
  private accessGrantedSubject = new Subject<void>();

  constructor(private http: HttpClient) {}

  
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

  }

  ngOnDestroy(): void {
    this.stopConnection();
  }
}
