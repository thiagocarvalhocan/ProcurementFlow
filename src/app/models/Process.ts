export interface Process {
  id: number;
  unitId: number;
  processNumber: string;
  startDate: string;
  endDate: string;
  valueBudget: number;
  defalcation: boolean;
  changeOwnership: boolean;
  twoOpened: boolean;
  reasonDefalcation: string;
  statusProcessId: number;
  descriptionStatusProcess: string;
}
