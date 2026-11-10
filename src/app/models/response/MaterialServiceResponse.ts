export interface MaterialServiceResponse {
  warningGeneral?: string | null;
  codeSaab?: string | null;
  endDate?: Date | null;
  startDate?: Date | null;
  description: string;
  descriptionSupply?: string | null;
  descriptionManegement?: string | null;
  descriptionGroup?: string | null;
  descriptionRule?: string | null;
  descriptionTypeMaterial?: string | null;
  supplyId?: number | null;
  manegementId?: number | null;
  groupId?: number | null;
  id: number;
  ruleId?: number | null;
  typeMaterialId?: number | null;
  active: boolean;
}
