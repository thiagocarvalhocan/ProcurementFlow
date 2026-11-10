import { Injectable } from '@angular/core';
import { AdvanceRequest } from '../models/AdvanceRequest';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { PaginatedResult } from '../models/base/paginated-results';
import { Observable } from 'rxjs';
import { AdvanceRequestMonth } from '../models/AdvanceRequestMonth';
import { AdvanceRequestResponse } from '../models/response/AdvanceRequestResponse';

export interface GetAdvanceRequestsPayload {
  searchTerm: string;
  page: number;
  pageSize: number;
  sortColumn: string;
  sortDirection: string;
}

@Injectable({
  providedIn: 'root',
})
export class AdvanceRequestsService {
  constructor(private http: HttpClient) {}

  private uri: string = environment.api.uriv0.concat('/AdvanceRequest');

  getAdvancedRequestsPaged(payload: string): Observable<AdvanceRequestResponse> {
    const params = new URLSearchParams(payload).toString();
    return this.http.get<AdvanceRequestResponse>(this.uri.concat('?', params));
  }

  getAdvanceRequestById(id: number) {
    return this.http.get<AdvanceRequest>(this.uri.concat(`/${id}`));
  }


  getAdvanceRequestsPaged = this.getAdvancedRequestsPaged.bind(this);
  getRequisitionById = this.getAdvanceRequestById.bind(this);
  getValidationStartRegistration = this.getValidationStartProcess.bind(this);
  createMonthly = this.insert.bind(this);
  updateMonthRequest = this.putMonthRequest.bind(this);

  getValidationStartProcess() {
    return this.http.get<any>(
      this.uri.concat('/validation-start-registration')
    );
  }

  getValidationMonthlyRequest() {
    return this.http.get<any>(
      this.uri.concat('/validation-monthly-request')
    );
  }

  insert(payload: any) {
    return this.http.post<any>(this.uri.concat('/monthly'), payload);
  }

  update(id: any, payload: any) {
    return this.http.put<any>(this.uri.concat(`/${id}`), payload);
  }

  getRequestMonths(payload: any, unitId: number) {
    const params = new URLSearchParams(payload).toString();
    return this.http.get<PaginatedResult<AdvanceRequestMonth[]>>(
      this.uri.concat(`/${unitId}/months?`, params)
    );
  }

  getInitialMonthsValue() {
    return this.http.get<any>(this.uri.concat('/months-initial-value'));
  }

  putMonthRequest(payload: any, unitId: number) {
    return this.http.put<any>(
      this.uri.concat(
        `/${unitId}/month/${payload.advanceRequestMonthId}`
      ),
      payload
    );
  }
}
