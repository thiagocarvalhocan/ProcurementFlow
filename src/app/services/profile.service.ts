import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { PaginatedResult } from '../models/base/paginated-results';
import { ProfileBase } from '../models/ProfileBase';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private uri: string = environment.api.uriv0.concat('/profile');

  constructor(private http: HttpClient) {}

  getAllPaged(payload: any): Observable<PaginatedResult<ProfileBase[]>> {
    const params = new URLSearchParams(payload).toString();
    return this.http.get<PaginatedResult<ProfileBase[]>>(
      this.uri.concat('/paginated?' + params)
    );
  }

  getAll(): Observable<any> {
    return this.http.get<any>(this.uri);
  }

  insert(payload: any): Observable<any> {
    return this.http.post<any>(this.uri, payload);
  }

  update(payload: any): Observable<any> {
    return this.http.put<any>(this.uri.concat(`/${payload.id}`), payload);
  }
}
