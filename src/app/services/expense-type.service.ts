import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { DropdownSelect } from '../models/DropdownSelect';

@Injectable({
  providedIn: 'root',
})
export class ExpenseTypeService {
  private uri: string = environment.api.uriv0.concat('/ExpenseType');

  constructor(private http: HttpClient) {}

  getTipo() {
    return this.http.get<DropdownSelect[]>(this.uri);
  }
}
