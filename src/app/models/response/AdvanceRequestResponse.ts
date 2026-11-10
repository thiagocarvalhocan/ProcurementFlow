import { AdvanceRequest } from '../AdvanceRequest';

export interface AdvanceRequestResponse {
  data: AdvanceRequest[];
  totalElements: number;
  totalPages: number;
}
