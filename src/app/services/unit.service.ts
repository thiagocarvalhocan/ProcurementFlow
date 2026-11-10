import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { UnitSelectResponse } from '../models/response/UnitSelectResponse';
import { UnitResponse } from '../models/response/UnitResponse';
import { Page } from '../models/Page';
import HttpUtil from '../shared/utils/HttpUtil';
import { OwnerSelectResponse } from '../models/response/OwnerSelectResponse';
import { HistoryResponse } from '../models/response/HistoryResponse';
import { UnitsPayload } from '../models/UnitsPayload';
import { UserUnitResponse } from '../models/response/UserUnitResponse';
import { Observable } from 'rxjs';
import { Unit } from '../models/Unit';

interface UnitQueryParams {
  sortDirection: number;
}

@Injectable({
  providedIn: 'root',
})
export class UnitService {
  private readonly uri = `${environment.api.uriv0}/Unit`;

  constructor(private readonly http: HttpClient) {}

  getUnits(payload: UnitsPayload, IdsRajs?: number) {
    let url = `${this.uri}?${HttpUtil.getQueryParams(payload)}${
      IdsRajs ? `&IdsRajs=${IdsRajs}` : ``
    }`;

    return this.http.get<UnitSelectResponse[]>(url);
  }


  getAllPaged(payload: any) {
    return this.http.get<Page<UnitResponse>>(
      this.uri.concat(`/paged?${HttpUtil.getQueryParams(payload)}`),
    );
  }

  getUsers(idUnit: number | undefined) {
    return this.http.get<OwnerSelectResponse[]>(
      this.uri.concat(`/${idUnit}/users`),
      {},
    );
  }

  getUsersPaged(idUnit: number | undefined, payload: any) {
    return this.http.get<Page<UserUnitResponse>>(
      this.uri.concat(
        `/${idUnit}/users/paged?${HttpUtil.getQueryParams(payload)}`,
      ),
    );
  }

  getHistoryPaged(idUnit: number | undefined, payload: any) {
    return this.http.get<Page<HistoryResponse>>(
      this.uri.concat(
        `/${idUnit}/history-ownership/paged?${HttpUtil.getQueryParams(
          payload,
        )}`,
      ),
    );
  }

  getUnitsAuto(Description: string, IdsRajs?: number) {
    let url = `${this.uri}${
      IdsRajs
        ? `?IdsRajs=${IdsRajs}&Description=${Description}`
        : `?Description=${Description}`
    }`;
    return this.http.get<UnitSelectResponse[]>(url);
  }

  getByID(id: any): Observable<Unit> {
    return this.http.get<Unit>(this.uri.concat(`/${id}`));
  }

  getCentersCostByUnit(idUnit: any, payload: any): Observable<any> {
    return this.http.get<any>(
      this.uri.concat(
        `/${idUnit}/centers-cost/paged?${HttpUtil.getQueryParams(
          payload,
        )}`,
      ),
    );
  }

  save(payload: Unit) {
    return this.http.post(this.uri, payload);
  }

  update(payload: Unit) {
    return this.http.put(this.uri.concat(`/${payload.id}`), payload);
  }

  link(unit: number, centerCost: number) {
    return this.http.patch(
      this.uri.concat(`/${unit}/link-center-cost/${centerCost}`),
      {},
    );
  }

  unlink(unit: number, centerCost: number) {
    return this.http.patch(
      this.uri.concat(`/${unit}/unlink-center-cost/${centerCost}`),
      {},
    );
  }

  changeOwner(idUnit?: number, idUserOwner?: number) {
    return this.http.patch(this.uri.concat(`/${idUnit}/change-owner`), {
      idUserOwner: idUserOwner,
    });
  }

  activate(idUnit?: number, idUserOwner?: number) {
    return this.http.patch(
      this.uri.concat(`/${idUnit}/activate/${idUserOwner}`),
      {},
    );
  }

  deactivate(idUnit?: number, idUserOwner?: number) {
    return this.http.patch(
      this.uri.concat(`/${idUnit}/deactivate/${idUserOwner}`),
      {},
    );
  }
}
