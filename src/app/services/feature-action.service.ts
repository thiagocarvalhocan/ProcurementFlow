import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FeatureActionService {
  private uri: string = environment.api.uriv0.concat('/FeatureAction');

  constructor(private http: HttpClient) {}

  getAllToFormNewProfile(): Observable<any> {
    return this.http.get<any>(this.uri.concat('/form-new-profile'));
  }
}
