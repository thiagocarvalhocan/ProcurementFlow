export interface MainProcess {
  endDate: string;
  startDate: string;
  descriptionStatusProcess: string;
  twoOpened: boolean;
  defalcation: boolean;
  id: number;
  reasonDefalcation: string | null;
  processNumber: string;
  statusProcessId: number;
  changeOwnership: boolean;
  unitId: number;
  valueBudget: number;
  descriptionUnit?: string;
}
