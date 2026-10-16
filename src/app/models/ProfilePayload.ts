import { SearchTablePayload } from './SearchTablePayload';

export interface ProfilePayload extends SearchTablePayload {
  searchString: string;
}
