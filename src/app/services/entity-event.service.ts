import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EntityEventService {
  private uri: string = environment.api.uriv0.concat('/EntityEvent');

  constructor(private http: HttpClient) {}

  getByIdEntity(entityId: number, entity: string): Observable<any> {
    return this.http.get<any>(this.uri.concat(`/${entity}/${entityId}`));
  }
}
