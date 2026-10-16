import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DropdownSelect } from '../models/DropdownSelect';

@Injectable({
  providedIn: 'root',
})
export class MonthService {
  private uri: string = environment.api.uriv0.concat('/Month');

  constructor(private http: HttpClient) {}

  getAll(): Observable<DropdownSelect[]> {
    return this.http.get<DropdownSelect[]>(this.uri);
  }
}
