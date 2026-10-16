import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { DropdownSelect } from '../models/DropdownSelect';

@Injectable({
  providedIn: 'root',
})
export class SupplyService {
  private uri: string = environment.api.uriv0.concat('/supply');

  constructor(private http: HttpClient) {}

  getAll(): Observable<DropdownSelect[]> {
    return this.http.get<DropdownSelect[]>(this.uri);
  }
}
