import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CostCenter } from '../models/CostCenter';

@Injectable({
  providedIn: 'root',
})
export class CostCenterService {
  private uri: string = environment.api.uriv0.concat('/CostCenter');

  constructor(private http: HttpClient) {}

  getCostsCenter(): Observable<CostCenter[]> {
    return this.http.get<CostCenter[]>(this.uri);
  }
}
