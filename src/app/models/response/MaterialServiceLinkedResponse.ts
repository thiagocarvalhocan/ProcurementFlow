import { UnitSelectResponse } from './UnitSelectResponse';

export interface MaterialServiceLinkedResponse {
  active?: boolean;
  endDate?: string | null;
  startDate?: string | null;
  descriptionRaj?: string;
  idMaterialServiceLink?: number;
  materialServiceId?: number;
  rajId?: number;
  typeLinkMaterialServiceId?: number;
  units?: string;
  units2?: UnitSelectResponse[];
}
