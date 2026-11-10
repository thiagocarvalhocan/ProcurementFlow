import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { MaterialService } from '../models/MaterialService';
import { Page } from '../models/Page';
import { MaterialServiceResponse } from '../models/response/MaterialServiceResponse';
import HttpUtil from '../shared/utils/HttpUtil';
import { MaterialSearch } from '../models/MaterialSearch';
import { MaterialServicesByBudgetResponse } from '../models/response/MaterialServicesByBudgetResponse';
import { MaterialByBudgetPayload } from '../models/MaterialByBudgetPayload';

@Injectable({
  providedIn: 'root',
})
export class MaterialServiceService {
  materialService: MaterialService | undefined;

  private uri: string = environment.api.uriv0.concat('/MaterialService');

  constructor(private http: HttpClient) {}

  getAllPaginated(payload: any) {
    return this.http.get<Page<MaterialServiceResponse>>(
      this.uri.concat(`/paginated?${HttpUtil.getQueryParams(payload)}`),
    );
  }

  getByID(id: any): Observable<MaterialService> {
    return this.http.get<MaterialService>(this.uri.concat(`/${id}`));
  }

  getMaterialsByUnit(payload: MaterialSearch, idUnit: number | null) {
    return this.http.get<MaterialServiceResponse[]>(
      this.uri.concat(
        `/to-link/${idUnit}?${HttpUtil.getQueryParams(payload)}`,
      ),
    );
  }

  getMaterialsByIdBudget(
    payload: MaterialByBudgetPayload,
    idBudget: number | null,
  ) {
    return this.http.get<MaterialServicesByBudgetResponse[]>(
      this.uri.concat(
        `/to-link/budget/${idBudget}?${HttpUtil.getQueryParams(
          payload,
        )}`,
      ),
    );
  }

  save(payload: MaterialService) {
    return this.http.post<MaterialService>(this.uri, payload);
  }

  update(payload: MaterialService) {
    return this.http.put<MaterialService>(
      this.uri.concat(`/${payload.id}`),
      payload,
    );
  }

  enable(idMaterialService: number) {
    return this.http.patch<any | null>(
      this.uri.concat(`/${idMaterialService}/activate`),
      null,
    );
  }

  disable(idMaterialService: number) {
    return this.http.patch<any | null>(
      this.uri.concat(`/${idMaterialService}/deactivate`),
      null,
    );
  }
}
