import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { UnitSelectResponse } from '../models/response/UnitSelectResponse';

interface UnitQueryParams {
  sortDirection: number;
}

@Injectable({
  providedIn: 'root',
})
export class UnitService {
  private readonly baseUrl = `${environment.api.uriv0}/Unit`;

  constructor(private readonly http: HttpClient) {}

  getUnits(params: UnitQueryParams) {
    const queryParams = new URLSearchParams({
      sortDirection: String(params.sortDirection),
    });

    return this.http.get<UnitSelectResponse[]>(`${this.baseUrl}?${queryParams}`);
  }
}
