import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { AdvanceRequestMessageResponse } from '../models/response/AdvanceRequestMessageResponse';
import { Page } from '../models/Page';
import { AdvanceMessage } from '../models/AdvanceMessage';

@Injectable({
  providedIn: 'root',
})
export class AdvanceRequestMessageService {
  private uri: string = environment.api.uriv0.concat(
    '/AdvanceRequestMessage'
  );

  constructor(private http: HttpClient) {}

  getMessagesPaged(payload: string) {
    const params = new URLSearchParams(payload).toString();
    return this.http.get<Page<AdvanceRequestMessageResponse>>(
      this.uri.concat('/paged?' + params)
    );
  }


  getMessagePaged = this.getMessagesPaged.bind(this);
  insertMessageFixa = this.insertFixedMessage.bind(this);
  updateMessageFixa = this.updateFixedMessage.bind(this);
  insertMessageDinamica = this.insertDynamicMessage.bind(this);
  updateMessageDinamica = this.updateDynamicMessage.bind(this);

  getDynamicMessagesByMonth(monthId: number) {
    return this.http.get<Page<AdvanceRequestMessageResponse>>(
      this.uri.concat(`/dynamic/month/${monthId}`)
    );
  }

  insertFixedMessage(payload: AdvanceMessage) {
    return this.http.post<AdvanceMessage>(this.uri.concat('/fixed'), payload);
  }

  updateFixedMessage(payload: AdvanceMessage) {
    return this.http.put<AdvanceMessage>(
      this.uri.concat(`/${payload.id}/fixed`),
      payload
    );
  }

  activate(id: number) {
    return this.http.patch<AdvanceRequestMessageResponse>(
      this.uri.concat(`/${id}/activate`),
      null
    );
  }


  enable = this.activate.bind(this);
  disable = this.deactivate.bind(this);

  deactivate(id: number) {
    return this.http.patch<AdvanceRequestMessageResponse>(
      this.uri.concat(`/${id}/deactivate`),
      null
    );
  }

  delete(id: number) {
    return this.http.delete<AdvanceMessage>(this.uri.concat(`/${id}`));
  }

  insertDynamicMessage(payload: AdvanceMessage) {
    return this.http.post<AdvanceMessage>(
      this.uri.concat('/dynamic'),
      payload
    );
  }

  updateDynamicMessage(payload: AdvanceMessage) {
    return this.http.put<AdvanceMessage>(
      this.uri.concat(`/${payload.id}/dynamic`),
      payload
    );
  }
}
