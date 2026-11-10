import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Page } from '../models/Page';
import { MaterialServiceService } from './material-service.service';
import { MaterialServiceResponse } from '../models/response/MaterialServiceResponse';
import { environment } from '../../environments/environment';
import { AlertResponse } from '../models/response/AlertResponse';
import { LinkedAlert } from '../models/LinkedAlert';
import { Alert } from '../models/Alert';

@Injectable({
  providedIn: 'root',
})
export class MaterialServiceAlertService {
  materialServiceLink: MaterialServiceResponse | undefined;

  private uri: string = environment.api.uriv0.concat('/MaterialServiceWarning');

  constructor(
    private http: HttpClient,
    private serviceMaterialService: MaterialServiceService,
  ) {
    this.materialServiceLink = this.serviceMaterialService.materialService;
  }

  getAllPaginated(payload: LinkedAlert) {
    this.materialServiceLink = this.serviceMaterialService.materialService;
    const id = this.materialServiceLink?.id
      ? this.materialServiceLink.id
      : payload.materialServiceId;

    let params = new HttpParams({
      fromObject: {
        skip: payload.skip.toString(),
        take: payload.take.toString(),
      },
    });

    payload?.IdsRajs?.forEach(
      (num: { toString: () => string | number | boolean }) =>
        (params = params.append('IdsRajs', num.toString())),
    );

    if (payload.UnitSofName) {
      params = params.append('DescriptionUnitSof', payload.UnitSofName);
    }
    if (payload.Description) {
      params = params.append('DescriptionWarning', payload.Description);
    }

    if (payload.SortBy) {
      params = params.append('SortBy', payload.SortBy);
      params = params.append('SortDirection', payload.SortDirection);
    }

    return this.http.get<Page<AlertResponse>>(
      this.uri.concat(`/${id}/paginated?${params.toString()}`),
    );
  }

  getAllByIdUnit(idMaterialService: number | null, idUnit: number | null) {
    return this.http.get<any>(
      this.uri.concat(`/${idMaterialService}/descricoes/${idUnit}`),
    );
  }

  insert(payload: Alert, idMaterialService: string | null) {
    return this.http.post(this.uri.concat(`/${idMaterialService}`), payload);
  }

  update(
    payload: Alert,
    idMaterialService: string | null,
    idWarningMaterialService: number,
  ) {
    return this.http.put<Alert>(
      this.uri.concat(`/${idMaterialService}/${idWarningMaterialService}`),
      payload,
    );
  }

  enable(
    idMaterialService: number,
    idWarningMaterialService: number | undefined,
  ) {
    return this.http.patch<any | null>(
      this.uri.concat(
        `/${idMaterialService}/activate/${idWarningMaterialService}`,
      ),
      null,
    );
  }

  disable(
    idMaterialService: number,
    idWarningMaterialService: number | undefined,
  ) {
    return this.http.patch<any | null>(
      this.uri.concat(
        `/${idMaterialService}/desativar/${idWarningMaterialService}`,
      ),
      null,
    );
  }

  delete(
    idMaterialService: number | undefined,
    idWarningMaterialService: number | undefined,
  ) {
    return this.http.delete<any | null>(
      this.uri.concat(`/${idMaterialService}/${idWarningMaterialService}`),
    );
  }
}
