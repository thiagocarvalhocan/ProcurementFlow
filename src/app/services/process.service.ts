import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Process } from '../models/Process';
import { PaginatedResult } from '../models/base/paginated-results';
import { ProcessSearch } from '../models/ProcessSearch';

@Injectable({
  providedIn: 'root',
})
export class ProcessService {
  private uri: string = environment.api.uriv0.concat('/Process');

  constructor(private http: HttpClient) {}

  insert(payload: any, idUnit: number) {
    return this.http.post<Process>(this.uri.concat(`/${idUnit}`), payload);
  }

  update(payload: any, idUnit: number) {
    return this.http.put<Process>(
      this.uri.concat(`/${idUnit}/${payload.id}`),
      payload,
    );
  }

  getPaged(payload: any, idUnit: number) {
    const params = new URLSearchParams(payload).toString();
    return this.http.get<PaginatedResult<Process[]>>(
      this.uri.concat(`/${idUnit}/paginated?` + params),
    );
  }

  getStatusProcess(payload: any) {
    const params = new URLSearchParams(payload).toString();
    return this.http.get<number>(this.uri.concat(`/status-process?` + params));
  }

  getNumberProcesses(idUnit: number) {
    return this.http.get<ProcessSearch[]>(
      this.uri.concat(`/${idUnit}/processes`),
    );
  }

  getProcessYears(idUnit: number, processNumber: string) {
    return this.http.get<number[]>(
      this.uri.concat(`/${idUnit}/years-process/${processNumber}`),
    );
  }
}
