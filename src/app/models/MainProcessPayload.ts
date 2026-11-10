export interface MainProcessPayload {
  processNumber: string;
  startDate: string;
  endDate: string;
  valueBudget: number;
  defalcation: boolean;
  changeOwnership: boolean;
  twoOpened: boolean;
  reasonDefalcation: string;
}
