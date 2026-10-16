export interface Event {
  action: string;
  date: string;
  description: string;
  entity: string;
  featureName: string;
  entityId: number;
  responsibleId: number;
  responsibleName: string;
  editType: string | null;
}
