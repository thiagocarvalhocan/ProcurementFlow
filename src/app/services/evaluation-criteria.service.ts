import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { DropdownSelect } from '../models/DropdownSelect';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EvaluationCriteriaService {
  private uri: string = environment.api.uriv0.concat('/CompletionType');

  constructor(private http: HttpClient) {}

  getAll(): Observable<DropdownSelect[]> {
    return this.http.get<DropdownSelect[]>(this.uri);
  }
}
