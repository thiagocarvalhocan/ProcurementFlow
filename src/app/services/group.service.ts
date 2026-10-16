import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { DropdownSelect } from '../models/DropdownSelect';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  private uri: string = environment.api.uriv0.concat('/Group');

  constructor(private http: HttpClient) {}

  getAll(): Observable<DropdownSelect[]> {
    return this.http.get<DropdownSelect[]>(this.uri);
  }
}
