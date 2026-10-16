import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private uri: string = environment.api.uriv0.concat('/user');

  constructor(private http: HttpClient) {}

  authenticated() {
    return this.http.get<any>(this.uri.concat('/authenticated'));
  }

  get(payload: any): Observable<any> {
    const params = new URLSearchParams(payload).toString();
    return this.http.get<any>(this.uri.concat('/paginated?', params));
  }

  exportExcel() {
    return this.http.get<any>(this.uri.concat('/export-excel'), {
      responseType: 'blob' as 'json',
    });
  }

  getDirectoryUsers(employeeIdNameEmail: string) {
    return this.http.get<any>(
      this.uri.concat(`/directory-users/${employeeIdNameEmail}`)
    );
  }

  insert(payload: any) {
    return this.http.post<any>(this.uri, payload);
  }

  getById(id: number) {
    return this.http.get<any>(this.uri.concat(`/${id}`));
  }

  disable(id: any) {
    return this.http.patch<any>(this.uri.concat(`/${id}/deactivate`), null);
  }

  enable(id: any) {
    return this.http.patch<any>(this.uri.concat(`/${id}/activate`), null);
  }

  update(id: any, payload: any) {
    return this.http.put<any>(this.uri.concat(`/${id}`), payload);
  }

  getByName(name: string) {
    return this.http.get<any>(`${this.uri}/by-name/${name}`);
  }

  getAccountants() {
    return this.http.get<User[]>(`${this.uri}/accountant`);
  }
}
