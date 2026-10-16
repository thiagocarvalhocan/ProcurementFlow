import { UnitSelectResponse } from "./UnitSelectResponse";

export interface AlertResponse {
  materialServiceAlertId?: number;
  materialServiceAlertTypeId?: number;
  materialServiceAlertTypeDescription?: string;
  description?: string;
  isActive?: boolean;
  endDate?: string | null;
  startDate?: string | null;
  regionOfficeName?: string;
  materialServiceLinkId?: number;
  materialServiceId?: number;
  regionOfficeId?: number;
  materialServiceLinkTypeId?: number;
  units?: string;
  units2?: UnitSelectResponse[];
}
