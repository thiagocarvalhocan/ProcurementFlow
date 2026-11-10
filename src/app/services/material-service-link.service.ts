import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Page } from '../models/Page';
import { MaterialServiceService } from './material-service.service';
import { MaterialServiceUnit } from '../models/MaterialServiceUnit';
import { MaterialServiceResponse } from '../models/response/MaterialServiceResponse';
import { LinkedUnit } from '../models/LinkedUnit';
import { MaterialServiceLinkedResponse } from '../models/response/MaterialServiceLinkedResponse';
import { LinkedUnitUpdate } from '../models/LinkedUnitUpdate';
import { MaterialLinkPayload } from '../models/MaterialLinkPayload';
import { MaterialServiceLinkedUnitResponse } from '../models/response/MaterialServiceLinkedUnitResponse';

@Injectable({
  providedIn: 'root',
})
export class MaterialServiceLinkService {
  materialServiceLink: MaterialServiceResponse | undefined;

  private uri: string = environment.api.uriv0.concat('/MaterialServiceLink');

  constructor(
    private http: HttpClient,
    private serviceMaterialService: MaterialServiceService,
  ) {
    this.materialServiceLink = this.serviceMaterialService.materialService;
  }

  getAllPaginated(payload: LinkedUnit) {
    this.materialServiceLink = this.serviceMaterialService.materialService;
    const id = this.materialServiceLink?.id
      ? this.materialServiceLink.id
      : payload.idMaterialService;

    let params = new HttpParams({
      fromObject: {
        skip: payload.skip.toString(),
        take: payload.take.toString(),
      },
    });

    payload?.RajIds?.forEach(
      (num: { toString: () => string | number | boolean }) =>
        (params = params.append('RajIds', num.toString())),
    );

    if (payload.UnitDescription) {
      params = params.append('UnitDescription', payload.UnitDescription);
    }

    if (payload.SortBy) {
      params = params.append('SortBy', payload.SortBy);
      params = params.append('SortDirection', payload.SortDirection);
    }

    return this.http.get<Page<MaterialServiceLinkedResponse>>(
      this.uri.concat(`/${id}/paginated?${params.toString()}`),
    );
  }

  insert(payload: LinkedUnit, idMaterialService: string | null) {
    if (payload.UnitDescription == null) {
      payload.UnitDescription = '';
    }
    return this.http.post(
      this.uri.concat(`/${idMaterialService}/link`),
      payload,
    );
  }

  update(
    payload: LinkedUnitUpdate,
    idMaterialService: string | null,
    idMaterialServiceLink: number,
  ) {
    return this.http.put<any>(
      this.uri.concat(`/${idMaterialService}/link/${idMaterialServiceLink}`),
      payload,
    );
  }

  delete(
    idMaterialService: number | undefined,
    idMaterialServiceLink: number | undefined,
  ) {
    return this.http.delete<any | null>(
      this.uri.concat(`/${idMaterialService}/unlink/${idMaterialServiceLink}`),
    );
  }

  enable(
    idMaterialService: number | undefined,
    idMaterialServiceLink: number | undefined,
  ) {
    return this.http.patch<any | null>(
      this.uri.concat(
        `/${idMaterialService}/activate/${idMaterialServiceLink}`,
      ),
      null,
    );
  }

  disable(
    idMaterialService: number | undefined,
    idMaterialServiceLink: number | undefined,
  ) {
    return this.http.patch<any | null>(
      this.uri.concat(
        `/${idMaterialService}/deactivate/${idMaterialServiceLink}`,
      ),
      null,
    );
  }

  getAllPagedByUnit(idUnit: number | undefined, payload: MaterialServiceUnit) {
    const simplePayload: { [key: string]: string | number | boolean } = {};

    for (const key in payload) {
      if (payload.hasOwnProperty(key)) {
        simplePayload[key] =
          payload[key] !== undefined ? String(payload[key]) : '';
      }
    }
    const params = new HttpParams({ fromObject: simplePayload });

    return this.http.get<Page<MaterialServiceLinkedUnitResponse>>(
      `${this.uri}/paginated/${idUnit}`,
      { params },
    );
  }

  link(idUnit: number | null, payload: MaterialLinkPayload) {
    return this.http.put(this.uri.concat(`/link/${idUnit}`), payload);
  }

  unlink(id: number | null) {
    return this.http.put(this.uri.concat(`/${id}/unlink`), {});
  }
}
