import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { RAJ } from '../models/RAJ';

@Injectable({
  providedIn: 'root'
})
export class RajService {

  private uri: string = environment.api.uriv0.concat('/Raj');

  constructor(private http: HttpClient) { }

  getRajs(): Observable<RAJ[]> {
    return this.http.get<RAJ[]>(this.uri);
  }

}
