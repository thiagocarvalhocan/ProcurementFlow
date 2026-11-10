import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { DropdownSelect } from '../models/DropdownSelect';

@Injectable({
  providedIn: 'root',
})
export class MonthlyAdvanceRequestStatusService {
  private uri: string = environment.api.uriv0.concat(
    '/StatusAdvanceRequestMonth'
  );

  constructor(private http: HttpClient) {}

  get() {
    return this.http.get<DropdownSelect[]>(this.uri);
  }
}
