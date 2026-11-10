import { SearchTablePayload } from './SearchTablePayload';

export interface RequestsSearchPayload extends SearchTablePayload {
  yearProcess?: number;
  idTypeBudget?: number;
  processNumber?: string;
  firstLoad: boolean;
}
