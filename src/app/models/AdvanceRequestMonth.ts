export interface AdvanceRequestMonth {
  advanceRequestMonthId: number;
  advanceRequestId: number;
  processId: number;
  unitId: number;
  processNumber: string;
  integrationId: number;
  accountantName: string;
  monthId: number;
  monthDescription: string;
  budgetTypeId: number;
  budgetTypeDescription: string;
  budgetValue: number;
  requestMonthStatusId: number;
  requestMonthStatusDescription: string;
  statusChangeReason?: string | null;
  linkedProcessId?: number | null;
  accountantUserId?: number | null;
}
